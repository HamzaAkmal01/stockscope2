const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const Stock = require('./Stock');

class Wishlist extends Model {}

Wishlist.init(
  {
    Wishlist_ID: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User_Table",
        key: "UserID",
      },
    },
    Stock_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Stock_Table",
        key: "StockID",
      },
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Wishlist",
    tableName: "Wishlist",
    timestamps: false,
  }
);

Wishlist.belongsTo(Stock, { foreignKey: 'Stock_ID', as: 'Stock' });

module.exports = Wishlist;