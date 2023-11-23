const jwt = require("../utils/jwt_utils");
const { User, Spending, Budget } = require("../models");
const { Op } = require("sequelize");

// 지출 설정
// note: 동일한 카테고리가 있을 경우 제외,
const postSetSpending = async (req, res) => {
  const { user_id, category, price, comment } = req.body;
  const spending = await Spending.create({
    user_id: user_id,
    category: category,
    price: Number(price),
    comment: comment,
  });

  res.json({
    result: spending,
    message: "지출 설정 완료",
  });
};

// 지출 수정 >> Budget에 업데이트 하는 기능 추가 필요
const patchSpending = async (req, res) => {
  const { spending_id, user_id, category, price, comment } = req.body;

  const result = await Spending.update(
    {
      category: category,
      price: price,
      comment: comment,
    },
    {
      where: { id: spending_id, user_id: user_id },
    }
  );
  res.json({ result: result, message: "update spending" });
};

// 지출 삭제
const deleteSpending = async (req, res) => {
  const { spending_id, user_id } = req.body;
  const spend = await Spending.findOne({
    where: { id: spending_id, user_id: user_id },
  });

  const result = await Spending.destroy({
    where: { id: spending_id, user_id: user_id },
  });
  res.json({
    result: result,
    message: "Delete spending",
  });
};

// 지출 확인
const getSpending = async (req, res) => {
  const { user_id, category, startDate, endDate, minAmount, maxAmount } =
    req.body;

  const userFilters = {
    user_id,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
  };
  const result = await searchSpending(userFilters);
  console.log("조회 결과 : ", result);
  res.json({
    result: result,
  });
};

// 사용자의 조건에 따라 지출 검색
const searchSpending = async (userFilters) => {
  // Sequelize의 where 객체를 동적으로 구성

  // 필터링할 조건을 저장할 빈 객체
  const whereClause = {
    user_id: userFilters.user_id, // user_id 필터 추가
  };

  // 카테고리
  userFilters.category && (whereClause.category = userFilters.category);

  // createdAt에 대한 필터링을 위한 객체
  const dateClause = {};

  // startDate
  dateClause[Op.gte] = userFilters.startDate || undefined;

  // endDate
  dateClause[Op.lte] = userFilters.endDate || undefined;

  if (
    userFilters.startDate === undefined &&
    userFilters.endDate === undefined
  ) {
    userFilters.startDate = new Date();
    userFilters.endDate = new Date();
  }

  // dateClause가 비어있지 않은 경우 createdAt 필터 추가
  Object.keys(dateClause).length > 0 && (whereClause.createdAt = dateClause);

  // amount에 대한 필터링을 위한 객체
  const amountClause = {};

  // minAmount 필터 추가 (만약 주어졌을 경우에만)
  amountClause[Op.gte] = userFilters.minAmount || undefined;

  // maxAmount 필터 추가 (만약 주어졌을 경우에만)
  amountClause[Op.lte] = userFilters.maxAmount || undefined;

  // amountClause가 비어있지 않은 경우 amount 필터 추가
  Object.keys(amountClause).length > 0 && (whereClause.amount = amountClause);

  // Spending 테이블에서 조건에 맞는 데이터 검색
  const result = await Spending.findAll({
    where: whereClause,
  }).catch((err) => {
    console.error("조건에 맞는 지출 데이터를 가져오는 중 오류 발생:", err);
  });
  return result;
};

module.exports = {
  postSetSpending,
  patchSpending,
  deleteSpending,
  getSpending,
};
