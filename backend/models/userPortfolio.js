const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class UserPortfolio extends Model {}

UserPortfolio.init(
  {
    Portfolio_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User_Table",
        key: "UserID",
      },
    },
    Stock_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Stock_Table",
        key: "StockID",
      },
    },
    Owned_Shares: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    Total_Investment: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    Average_Purchase: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    modelName: "UserPortfolio",
    tableName: "User_Portfolio",
    timestamps: false,
  }
);

module.exports = UserPortfolio;