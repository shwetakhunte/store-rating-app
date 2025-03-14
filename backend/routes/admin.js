const express = require("express");
const db = require("../config/db");
const router = express.Router();
//const bcrypt = require("bcrypt");

//  Get Dashboard Stats (Total Users, Stores, Ratings)
router.get("/api/admin/dashboard", (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM users) AS total_users, 
            (SELECT COUNT(*) FROM stores) AS total_stores, 
            (SELECT COUNT(*) FROM ratings) AS total_ratings
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        console.log("Dashboard Data:", results);
        res.json({ data: results[0] });
    });
});

// ✅ Get Users List (Admin & Normal Users)
router.get("/api/admin/users", (req, res) => {
    const query = `
        SELECT users.id, users.name, users.email, users.address, users.role,
         COALESCE
         (user_ratings.avg_rating, 0) 
         AS rating FROM users LEFT JOIN 
         ( SELECT stores.owner_id, AVG(ratings.rating)
           AS avg_rating FROM stores LEFT JOIN ratings ON 
           stores.id = ratings.store_id GROUP BY stores.owner_id ) 
           AS user_ratings ON users.id = user_ratings.owner_id;

    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        console.log('user data', results)
        res.json(results);
    });
});


// Add New User (Admin or Normal User)

router.post("/api/admin/add-user", async (req, res) => {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, address, role],
            (err) => {
                if (err) return res.status(500).json({ message: "Error adding user" });

                res.json({ message: "User added successfully" });
            }
        );
    } catch (error) {
        return res.status(500).json({ message: "Error hashing password" });
    }
});


// ✅ Get All Stores
router.get("/api/admin/stores", (req, res) => {
    db.query("SELECT stores.id, stores.name, stores.address, COALESCE(AVG(ratings.rating), 0) AS overall_rating FROM stores LEFT JOIN ratings ON stores.id = ratings.store_id GROUP BY stores.id",
        (err, results) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json(results);
        }
    );
});

// ✅ Add New Store
router.post("/api/admin/add-store", (req, res) => {
    const { name, address, owner_id } = req.body;
    db.query(
        "INSERT INTO stores (name, address, owner_id) VALUES (?, ?, ?)",
        [name, address, owner_id],
        (err) => {
            if (err) return res.status(500).json({ message: "Error adding store" });
            res.json({ message: "Store added successfully" });
        }
    );
});

module.exports = router;
