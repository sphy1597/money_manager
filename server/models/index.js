"use strict";

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = require("./User")(sequelize);
db.Budget = require("./Budget")(sequelize);
db.Spending = require("./Spending")(sequelize);

// 외래키 관계 설정
db.User.hasMany(db.Spending, { foreignKey: "user_id" });
db.Spending.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Budget, { foreignKey: "user_id" });
db.Budget.belongsTo(db.User, { foreignKey: "user_id" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
