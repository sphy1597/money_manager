const jwt = require("../utils/jwt_utils");
const { User, Spending } = require("../models");

// 지출 설정
// note : category별로 한번만 추가 가능하도록 수정하는 기능 추가하기
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

// 지출 수정
const patchSpending = async (req, res) => {
  const { id, user_id, category, price, comment } = req.body;

  const result = await Spending.update(
    {
      category: category,
      price: price,
      comment: comment,
    },
    {
      where: { id: id, user_id: user_id },
    }
  );
  res.json({ result: result, message: "update spending" });
};

// 지출 삭제
const deleteSpending = async (req, res) => {
  const { id, user_id } = req.body;

  const result = await Spending.destroy({
    where: { user_id: user_id, category: category },
  });

  res.json({
    result: result,
    message: "Delete spending",
  });
};

// 지출 확인 하기
const getSpending = async (req, res) => {
  const { user_id, id } = req.body;

  const result = await Spending.findAll({
    attributes: ["id", "user_id", "category", "price", "comment"],
    where: { id: id, user_id: user_id },
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
