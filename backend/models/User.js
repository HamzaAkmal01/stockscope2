const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const User = sequelize.define(
  "User",
  {
    UserID: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    FirstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    PhoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    UserType: {
      type: DataTypes.ENUM("Trader", "Investor", "Admin"),
      allowNull: false,
      defaultValue: "Trader",
    },
    AccountBalance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
    Account_Creation_Date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    Updation_In_Profile: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "User_Table",
    timestamps: false,
  },
)

module.exports = User
