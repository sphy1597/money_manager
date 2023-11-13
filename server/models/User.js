const { DataTypes, Sequelize, INTEGER } = require("sequelize");

// DB data
const User = (sequelize) => {
  return sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: Sequelize.STRING(100),
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
