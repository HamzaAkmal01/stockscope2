const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Stock = require("./Stock");

const StockPriceHistory = sequelize.define(
  "StockPriceHistory",
  {
    HistoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    StockID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Stock,
        key: "StockID",
      },
    },
    TickerSymbol: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    CurrentPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    OpeningPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    ClosingPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    HighPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    LowPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'Timestamp'
    },
  },
  {
    tableName: "stock_price_history",
    timestamps: false,
  }
);

// Define association
StockPriceHistory.belongsTo(Stock, { foreignKey: "StockID" });

module.exports = StockPriceHistory;