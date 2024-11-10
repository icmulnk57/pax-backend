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
  process.env.DB_PASSWORD || "password", 
  {
    host: process.env.DB_HOST || "localhost", 
    dialect: "mysql",
    dialectOptions: options,
    pool: poolOptions,
    logging: console.log,  
  }
);


console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "*****" : "Not Set"); 
console.log("DB_HOST:", process.env.DB_HOST);

(async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:");
    console.error("Error Code:", error.code);
    console.error("SQL State:", error.sqlState);
    console.error("Message:", error.sqlMessage);
    console.error("Stack Trace:", error.stack);
  }
})();

module.exports = db;
