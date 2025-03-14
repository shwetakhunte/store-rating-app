const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'store_ratings'
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

module.exports = db;
