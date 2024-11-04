require("dotenv").config();
const { Sequelize } = require("sequelize");

const options = {
  multipleStatements: true,
  connectTimeout: 180000,  // 3 minutes
};


const poolOptions = {
  max: 100,
  min: 0,
  idle: 10000,     
  acquire: 100000,  
};


const db = new Sequelize(
  process.env.DB_NAME || "pax_freight",     
  process.env.DB_USER || "root",         
  process.env.DB_PASSWORD || "",          
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    dialectOptions: options,
    pool: poolOptions,
    
  }
);


(async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = db;
