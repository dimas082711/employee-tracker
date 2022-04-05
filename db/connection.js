const mysql = require('mysql2')

require('dotenv').config();

const db = mysql.createConnection(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW,
    {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    
    }
)

module.exports = db;