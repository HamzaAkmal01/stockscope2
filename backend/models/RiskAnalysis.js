const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class RiskAnalysis extends Model {}

RiskAnalysis.init(
  {
    RiskAnalysisID: {
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
    Trend: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: {
          args: [["Bullish", "Bearish"]],
          msg: "Trend must be either 'Bullish' or 'Bearish'",
        },
      },
    },
    Setup: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: {
          args: [["BearishMomentum", "BullishMomentum", "OversoldBounce", "OverboughtPullback", "MiddleBandPullback"]],
          msg: "Setup must be one of: BearishMomentum, BullishMomentum, OversoldBounce, OverboughtPullback, MiddleBandPullback",
        },
      },
    },
    Threshold: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: {
          args: [["Overbought", "Oversold", "Neutral"]],
          msg: "Threshold must be one of: Overbought, Oversold, Neutral",
        },
      },
    },
    Momentum: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: {
          args: [["Healthy", "Weak", "Neutral"]],
          msg: "Momentum must be one of: Healthy, Weak, Neutral",
        },
      },
    },
    PriceAction: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: {
          args: [["Healthy", "Weak", "Neutral"]],
          msg: "PriceAction must be one of: Healthy, Weak, Neutral",
        },
      },
    },
    Signal: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: {
          args: [["Hold", "Buy_BullishReversal", "Buy_TrendContinuation", "Sell_BearishReversal", "Sell_TrendContinuation"]],
          msg: "Signal must be one of: Hold, Buy_BullishReversal, Buy_TrendContinuation, Sell_BearishReversal, Sell_TrendContinuation",
        },
      },
    },
    AnalysisTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "RiskAnalysis",
    tableName: "Risk_Analysis",
    timestamps: false,
  }
);

module.exports = RiskAnalysis;