const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class MarketNews extends Model {}

MarketNews.init(
  {
    News_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Stock_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Stock_Table",
        key: "StockID",
      },
    },
    Source: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Publish_Date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    News_Title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Headline: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "MarketNews",
    tableName: "Market_News",
    timestamps: false,
  }
);

module.exports = MarketNews;