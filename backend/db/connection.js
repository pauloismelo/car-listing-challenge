const mysql = require('mysql2');
require('dotenv').config()


const db = mysql.createPool({
    //host:"mysqljsadmin.cfc8migyqzmy.sa-east-1.rds.amazonaws.com",
   user:process.env.DB_USER,
   password:process.env.DB_PASS,
   database:process.env.DB_DATABASE,
   host: process.env.DB_HOST,
});


module.exports = db;