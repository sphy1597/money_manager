const redisClient = require("../utils/redis");

const cacheUpdate = async (user_id, category, price) => {
  const getOldValue = await redisClient.hGet(
    `user:${user_id}:price`,
    category,
    (err, oldValue) => {
      if (err) {
        console.error("Error getting category price", err);
      } else {
        const newPrice = Number(oldValue) + Number(price);
        console.log("old value : ", oldValue);
        redisClient.hSet(
          `user:${user_id}:price`,
          category,
          newPrice,
          (err, reply) => {
            err && console.log("error updating category price : ", err);
          }
        );
      }
    }
  );

  const getValue = await redisClient.hGet(`user:${user_id}:price`, category);
  console.log("getVlaue : ", getValue);
};

module.exports = { cacheUpdate };
