const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const User = require("./User")
const Stock = require("./Stock")

const Transaction = sequelize.define(
  "Transaction",
  {
    Transaction_ID: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    User_ID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "UserID",
      },
    },
    Stock_ID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Stock,
        key: "StockID",
      },
    },
    Transaction_Type: {
      type: DataTypes.ENUM("Buy", "Sell"),
      allowNull: false,
    },
    Price_Per_Share: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Total_Amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Transaction_Date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Transaction_Table",
    timestamps: false,
  },
)

// Define associations
Transaction.belongsTo(User, { foreignKey: "User_ID" })
Transaction.belongsTo(Stock, { foreignKey: "Stock_ID" })

module.exports = Transaction
