const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const User = require("./User")
const Stock = require("./Stock")

const Portfolio = sequelize.define(
  "Portfolio",
  {
    Portfolio_ID: {
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
    Owned_Shares: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Total_Investment: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Average_Purchase: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    tableName: "User_Portfolio",
    timestamps: false,
  },
)

// Define associations
Portfolio.belongsTo(User, { foreignKey: "User_ID" })
Portfolio.belongsTo(Stock, { foreignKey: "Stock_ID" })

module.exports = Portfolio
