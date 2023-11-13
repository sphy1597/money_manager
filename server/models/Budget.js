const { DataTypes, Sequelize, INTEGER } = require("sequelize");

// DB data
const Budget = (sequelize) => {
  return sequelize.define("budget", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    Kategorie: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    total_money: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    left_money: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    done: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
  });
};

module.exports = Budget;
