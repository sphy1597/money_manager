const jwt = require("../utils/jwt_utils");
const { User, Spending, Budget } = require("../models");

// 지출 설정
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
// note :  카테고리별, 기간별 조회 기능 구현
const getSpending = async (req, res) => {
  const { spending_id, user_id } = req.body;

  const result = await Spending.findAll({
    attributes: ["id", "user_id", "category", "price", "comment"],
    where: { id: spending_id, user_id: user_id },
  });
  console.log("result : ", result);
  res.json({
    result: result,
  });
};

module.exports = {
  postSetSpending,
  patchSpending,
  deleteSpending,
  getSpending,
};
