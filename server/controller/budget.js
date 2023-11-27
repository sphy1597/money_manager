const jwt = require("../utils/jwt_utils");
const { User, Budget } = require("../models");

// 예산 설정
// note : category별로 한번만 추가 가능하도록 수정하는 기능 추가하기
const postSetBudget = async (req, res) => {
  const { user_id, category, total_money } = req.body;
  const budget = await Budget.create({
    user_id: user_id,
    category: category,
    total_money: Number(total_money),
    left_money: Number(total_money),
  });

  res.json({
    result: budget,
    message: "예산 설정 완료",
  });
};

// 예산 수정
// NOTE : 달 별로 수정 기능 추가 필요
const patchBudget = async (req, res) => {
  const { user_id, category, total_money } = req.body;

  const result = await Budget.update(
    {
      total_money: total_money,
    },
    {
      where: { user_id: user_id, category: category },
    }
  );
  res.json({ result: result, message: "update budget" });
};

// 예산 삭제
const deleteBudget = async (req, res) => {
  const { user_id, category } = req.body;

  const result = await Budget.destroy({
    where: { user_id: user_id, category: category },
  });

  res.json({
    result: result,
    message: "Delete budget",
  });
};

// 예산 확인 하기
const getBudget = async (req, res) => {
  const { user_id } = req.body;

  const result = await Budget.findAll({
    attributes: ["category", "total_money", "left_money"],
    where: { user_id: user_id },
  });
  console.log("result : ", result);
  res.json({
    result: result,
  });
};

module.exports = { postSetBudget, patchBudget, deleteBudget, getBudget };
