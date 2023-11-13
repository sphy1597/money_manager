const { DataTypes, Sequelize, INTEGER } = require("sequelize");

// DB data
const Spending = (sequelize) => {
  return sequelize.define("spending", {
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
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    comment: {
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

module.exports = Spending;
