const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class TradingSession extends Model {}

TradingSession.init(
  {
    Session_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Exchange: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Starting_Time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Closing_Time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TradingSession",
    tableName: "Trading_Session",
    timestamps: false,
  }
);

module.exports = TradingSession;