const { createClient } = require("redis");

const redisClient = createClient();

redisClient.on("ready", () => console.log("redis is ready"));
redisClient.on("error", (error) => console.log("redis error:", error));
redisClient.connect();

module.exports = redisClient;
