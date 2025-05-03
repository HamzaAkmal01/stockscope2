const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ApiLog = sequelize.define(
  "ApiLog",
  {
    Log_ID: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    End_Point_Indexes: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Response_Data: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Status_Code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Time_Stamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "API_Logs",
    timestamps: false,
  }
);

module.exports = ApiLog;