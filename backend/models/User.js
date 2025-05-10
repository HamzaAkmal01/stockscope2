const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class User extends Model {}

User.init(
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Trader",
      validate: {
        isIn: {
          args: [["Trader", "Admin"]],
          msg: "UserType must be 'Trader' or 'Admin'",
        },
      },
    },
    AccountBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    Account_Creation_Date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    Updation_In_Profile: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "User_Table",
    timestamps: false,
  }
);

module.exports = User;