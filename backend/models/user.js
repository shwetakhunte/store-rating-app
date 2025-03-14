const db = require("../config/db.js");

const createUser = (user, callback) => {
    const checkEmailSql = `SELECT * FROM user WHERE email = ?`;
    
    db.query(checkEmailSql, [user.email], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        
        if (results.length > 0) {
            return callback(new Error("Email already in use"), null);
        }

        // Email doesn't exist, proceed with registration
        const insertSql = `INSERT INTO user (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;
        db.query(insertSql, [user.name, user.email, user.password, user.address, user.role], callback);
    });
};

module.exports = { createUser };
