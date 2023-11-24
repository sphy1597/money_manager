const { User, Spending, Budget } = require("../models");
const { Sequelize, Op } = require("sequelize");

// 오늘 지출 추천
const goodMorning = async (req, res) => {
  // 월별 예산을 만족하기 위헤 오늘 지출 가능한 금액과 카테고리 별 금액 제공
};

// 오늘 지출 안내
const goodNight = async (req, res) => {
  // 카테고리 별 통계
  const { user_id } = req.body;

  // 오늘 날짜 생성
  const today = new Date();
  // 오늘의 시작 시간 (0시 0분 0초)
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  // 오늘의 끝 시간 (23시 59분 59초)
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );

  // 카테고리 별
  const categoryStats = await getCategoryStats(user_id, startDate, endDate);

  for (const stat of categoryStats) {
    const category = stat.dataValues.category;
    const totalPrice = stat.dataValues.totalPrice;

    await adjustmentBudget(user_id, category, totalPrice);
  }

  // 전체
  const totalStats = await getTotalStats(user_id, startDate, endDate);
  const left_money = await getLeftBudget(user_id);
  console.log("category : ", categoryStats);

  res.json({
    categoryStats: categoryStats,
    todayTotal: totalStats,
    left_money: left_money,
  });
};

// 지출 내역을 예산에 업데이트
const adjustmentBudget = async (user_id, category, totalPrice) => {
  try {
    await Budget.update(
      { left_money: Sequelize.literal(`left_money - ${totalPrice}`) },
      { where: { user_id, category } }
    );
  } catch (err) {
    console.log(
      `카테고리 '${category}'의 left_money 업데이트 중 오류 발생: `,
      err
    );
    throw err; // 에러를 호출한 곳으로 다시 던집니다.
  }
};

// 남은 돈 가져오기
// note 달 별로 가져오는 기능 추가
const getLeftBudget = async (user_id) => {
  //
  const left_money = await Budget.findAll({
    attributes: ["category", "total_money", "left_money"],
    where: {
      user_id,
    },
  });

  return left_money;
};

// 해당 유저의 카테고리별 지출 합계
const getCategoryStats = async (user_id, startDate, endDate) => {
  const categoryStats = await Spending.findAll({
    attributes: [
      "category",
      [Sequelize.fn("SUM", Sequelize.col("price")), "totalPrice"],
    ],
    where: {
      user_id,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: ["category"],
  }).catch((err) => {
    console.log("카테고리별 데이터를 가져오는 중 오류 발생 : ", err);
    res.json({
      message: "카테고리별  데이터를 가져오는 중 오류 발생",
    });
  });
  return categoryStats;
};

// 해당 유저의 기간 전체 지출 합계
const getTotalStats = async (user_id, startDate, endDate) => {
  const totalStats = await Spending.findOne({
    attributes: [[Sequelize.fn("SUM", Sequelize.col("price")), "totalPrice"]],
    where: {
      user_id,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  }).catch((err) => {
    console.log("전체 데이터를 가져오는 중 오류 발생 : ", err);
    res.json({
      message: "전체 데이터를 가져오는 중 오류 발생",
    });
  });
  return totalStats;
};

const monthStats = async (req, res) => {
  // 월별 통계
};

const dayStats = async (req, res) => {
  // 일별 통계
};

const userStats = async (req, res) => {
  // 다른 유저 대비 통계
};

module.exports = { goodNight };
