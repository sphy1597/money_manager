const jwt = require("../utils/jwt_utils");
const { User, Spending, Budget } = require("../models");
const { Op, Sequelize } = require("sequelize");
const { getCacheAll, deleteCache } = require("./redis_func");

/* --------------- 아침 알림 ---------------- */
const goodMorning = async (req, res) => {
  // 월별 예산을 만족하기 위헤 오늘 지출 가능한 금액과 카테고리 별 금액 제공
  const { user_id } = req.body;
  const endDay = await Budget.findAll({
    attributes: [
      "category",
      "left_money",
      [
        Sequelize.literal(
          `DATEDIFF(DATE_ADD(createdAt, INTERVAL 30 DAY), CURDATE())`
        ),
        "days_left",
      ],
    ],
    where: {
      user_id: user_id,
    },
  });

  const today = {};
  endDay.forEach((item) => {
    const todaySpend =
      Math.round(item.left_money / item.dataValues.days_left / 100) * 100;
    if (todaySpend < 5000) {
      today[item.category] = {
        today_budget: 5000,
        message:
          "오늘 사용가능한 금액이 5천원 이하 입니다 ... 최대한 아껴 사용합시다",
      };
    } else {
      today[item.category] = {
        price: todaySpend,
      };
    }
  });

  res.json({
    "오늘의 추천 예산": today,
  });
};

/* --------------- 저녁 알림 ----------------- */
const goodNight = async (req, res) => {
  const { user_id } = req.body;
  const allCache = await getCacheAll(user_id);

  // 이전 예산 내역 확인
  const oldBudget = await getOldBudget(user_id);

  // 예산에서 Left_money 업데이트
  const updatedBudget = await updateLeftMoney(user_id, oldBudget, allCache);

  // 오늘 지출 평가
  const spendPer = await evaluate(oldBudget, allCache);

  // 캐싱된 정보 삭제
  await deleteCache(user_id);
  res.json({
    "오늘의 지출 내용": allCache,
    "지출 통계": spendPer,
  });
};

/* --------------- 저녁 알림 함수들 ----------------- */

// 이전 예산 정보 가져오기
const getOldBudget = async (user_id) => {
  const oldBudget = await Budget.findAll({
    attributes: ["category", "total_money", "left_money"],
    where: {
      user_id: user_id,
    },
  });

  // 오브젝트 형태로 만들어 관리
  const categoryInfo = {};

  oldBudget.forEach((budget) => {
    const category = budget.category;
    const total_money = budget.total_money;
    const left_money = budget.left_money;

    categoryInfo[category] = {
      total_money: total_money,
      left_money: left_money,
    };
  });
  return categoryInfo;
};

// 예산 left money 업데이트
const updateLeftMoney = async (user_id, oldBudget, allCache) => {
  for (let key in allCache) {
    await Budget.update(
      {
        left_money: Number(oldBudget[key].left_money) - Number(allCache[key]),
      },
      {
        where: {
          user_id,
          category: key,
        },
      }
    );
    // left money값 최신화
    oldBudget[key].left_money =
      Number(oldBudget[key].left_money) - Number(allCache[key]);

    // total money대비 left money 머니 퍼센트
    oldBudget[key].totalPerLeft =
      ((oldBudget[key].left_money / oldBudget[key].total_money) * 100).toFixed(
        2
      ) + "%";

    // total money 대비 오늘 지출 내역 머센트
    oldBudget[key].totalPerSpend =
      ((allCache[key] / oldBudget[key].total_money) * 100).toFixed(2) + "%";
  }

  return oldBudget;
};

// 지출 평가
// note : 날짜 계산까지 개발함, total/30해서 나온 값이랑 오늘 쓴 값 비교하고 남은 일수 계산해서 어떻게 써야할지 추천하는 기능 추가 필요
const evaluate = async (oldBudget, allCache) => {
  const spendPer = {};
  let averSum = 0;
  for (let key in allCache) {
    const recoSpend = Math.round(oldBudget[key].total_money / 30 / 100) * 100;
    const recoPer = ((allCache[key] / recoSpend) * 100).toFixed(2);
    spendPer[key] = {
      "예산 대비 비율": `총 예산 대비 지출 비율 :  ${(
        (allCache[key] / oldBudget[key].total_money) *
        100
      ).toFixed(2)}%`,
      "일일 추천 사용 금액": recoSpend,
      "추천 대비 사용 비율": `${recoPer}%`,
    };
    averSum = averSum + recoPer;
  }

  const averPer = averSum / Object.keys(allCache).length;
  if (averPer < 80) {
    spendPer.message = "절약을 잘하고 계십니다 !! ";
  } else if (averPer < 120) {
    spendPer.message = "오늘도 고생하셨습니다 !! ";
  } else {
    spendPer.message = "조금 아껴써야할거 같아요 ㅠㅠ";
  }

  console.log("spend Per : ", spendPer);
  return spendPer;
};

module.exports = { goodNight, goodMorning };
