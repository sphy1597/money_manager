const { DataTypes, Sequelize, INTEGER } = require("sequelize");

// DB data
const User = (sequelize) => {
  return sequelize.define("user", {
    user_id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },

    done: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
  });
};

module.exports = User;
