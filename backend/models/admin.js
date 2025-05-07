const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Admin extends Model {}

Admin.init(
  {
    Admin_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Admin_Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Admin_Pass: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    Creation_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "Admin_Table",
    timestamps: false,
  }
);

module.exports = Admin;