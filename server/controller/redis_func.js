const { RedisFlushModes } = require("redis");
const redisClient = require("../utils/redis");
const { User, Spending, Budget } = require("../models");

// redis 캐싱 업데이트
const cacheUpdate = async (user_id, category, price) => {
  // 기존값 확인
  const getOldValue = await redisClient.hGet(`user:${user_id}:price`, category);

  if (getOldValue) {
    // 기존 값 있을 경우 기존값 + 새로운 값 더하기
    const updateCache = await redisClient.hSet(
      `user:${user_id}:price`,
      category,
      Number(getOldValue) + Number(price)
    );
    console.log(" update cache : ", updateCache);
  } else {
    // 기존 값 없는 경우 새로 set
    const setCache = await redisClient.hSet(
      `user:${user_id}:price`,
      category,
      price
    );
    console.log(" set new cache : ", setCache);
  }
  const getValue = await redisClient.hGet(`user:${user_id}:price`, category);
  console.log("check result : ", getValue);
};

// user_id, category로 price 확인
const getCacheValue = async (user_id, category) => {
  const result = await redisClient.hGet(`user:${user_id}:price`, category);
  return result;
};

// user_id 의 모든 데이터 확인
const getCacheAll = async (user_id) => {
  const result = await redisClient.hGetAll(`user:${user_id}:price`);
  return result;
};

// 전체 유저 데이터 캐싱
const allUserStatsCache = async () => {
  // 유저 전체의 예산 합
  const allUserSum = await Budget.sum("total_money");

  const categorySum = await Budget.findAll({
    attributes: [
      "category",
      [Sequelize.fn("SUM", Sequelize.col("total_money")), "total_money_sum"],
    ],
    group: ["category"],
  });

  await redisClient.set("all_user_sum", allUserSum);

  categorySum.forEach((row) => {
    const category = row.category;
    const totalMoneySum = row.dataValues.total_money_sum;

    redisClient.hSet("categorySum", row, totalMoneySum);
  });
};

// 캐싱된 전체 유저 데이터 가져오기
// note :  카테고리 별로 가져오는 부분 추가 필요
const getAllUserStats = async () => {
  const allUser = redisClient.get("all_user_sum");

  // 가져올 카테고리
  const categoryName = "식비";
  const categorySum = redisClient.hGet("categorySum", categoryName);
};

const deleteCache = async () => {
  const keys = await redisClient.keys(`user:${user_id}:*`);

  if (keys.length > 0) {
    const deletedKeysCount = await redisClient.del(keys);
    console.log(`Deleted ${deletedKeysCount} keys for user ${user_id}`);
  } else {
    console.log(`No keys found for user ${user_id}`);
  }
};
module.exports = {
  cacheUpdate,
  getCacheValue,
  allUserStatsCache,
  getCacheAll,
  getAllUserStats,
  deleteCache,
};
