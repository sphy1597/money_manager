const jwt = require("../utils/jwt_utils");
const { User, Spending, Budget } = require("../models");

// 지출 설정
// note : set 하면 해당 카테고리의 예산에서 값을 줄이기
const postSetSpending = async (req, res) => {
  const { user_id, category, price, comment } = req.body;
  const spending = await Spending.create({
    user_id: user_id,
    category: category,
    price: Number(price),
    comment: comment,
  });
  // 예산에서 사용한 값을
  const leftBudget = await updateBudget(user_id, category, 0 - Number(price));
  res.json({
    result: leftBudget,
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
  // 지출이 삭제 되어 예산에서 지출을 원래대로 바꿈
  const leftBudget = await updateBudget(user_id, spend.category, spend.price);
  const result = await Spending.destroy({
    where: { id: spending_id, user_id: user_id },
  });
  res.json({
    result: leftBudget,
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

// 사용한 예산을 Budget 테이블의 left_money에 적용함
const updateBudget = async (_user_id, _category, _price) => {
  const result = await Budget.update(
    {
      left_money: Sequelize.literal(`left_money + ${_price}`),
    },
    {
      where: {
        user_id: _userId,
        category: _category,
      },
    }
  );

  return result;
};

module.exports = {
  postSetSpending,
  patchSpending,
  deleteSpending,
  getSpending,
};
