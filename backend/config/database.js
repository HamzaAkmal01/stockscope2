const { Sequelize } = require("sequelize");
require("dotenv").config();

// Extract instance name from DB_SERVER (e.g., "localhost\\SQLEXPRESS")
const [host, instanceName] = process.env.DB_SERVER.split("\\");

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || "RSMA",
  process.env.DB_USER || "sa",
  process.env.DB_PASSWORD || "116142",
  {
    host: host || "localhost",
    dialect: "mssql",
    port: process.env.DB_PORT || 1433,
    dialectOptions: {
      options: {
        instanceName: instanceName || "SQLEXPRESS",
        encrypt: false, // or true if required
        trustServerCertificate: true,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection to the database has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
}

testConnection();

module.exports = sequelize;
