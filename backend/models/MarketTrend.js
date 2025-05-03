const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Stock = require("./Stock");

const MarketTrend = sequelize.define(
  "MarketTrend",
  {
    Trend_ID: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Stock_ID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Stock,
        key: "StockID",
      },
    },
    Past_50_Days_Average: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Relative_Strength_Index: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Bollinger_Bands: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Updated_Time_Stamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Market_Trend",
    timestamps: false,
  }
);

// Define association
MarketTrend.belongsTo(Stock, { foreignKey: "Stock_ID" });

module.exports = MarketTrend;