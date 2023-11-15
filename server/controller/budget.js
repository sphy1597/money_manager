const jwt = require("../utils/jwt_utils");
const { User, Budget } = require("../models");

// 예산 설정
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

module.exports = { postSetBudget };
