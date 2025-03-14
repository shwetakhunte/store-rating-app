const express = require("express");
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcrypt");
const db = require("../config/db"); // Make sure this points to your DB connection
const { authenticateUser, authenticateStoreOwner } = require("../middleware/auth");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Ensure it's set in your env file

// ✅ Store Owner Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        // Check if password is correct
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid password" });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "24h" });

        res.json({ message: "Login successful", token, role: user.role });
    });
});

// ✅ Store Owner Update Password
router.post("/api/store-owner/update-password", authenticateStoreOwner, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const [user] = await db.promise().query("SELECT password FROM users WHERE id = ?", [req.user.id]);

        if (!user.length) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(401).json({ message: "Incorrect current password" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, req.user.id], (err) => {
            if (err) return res.status(500).json({ message: "Error updating password", error: err });
            res.json({ message: "Password updated successfully" });
        });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ View a list of users who submitted ratings for the store
router.get("/api/store-owner/ratings", authenticateStoreOwner, async (req, res) => {
    try {
        const storeOwnerId = req.user.id;

        // Get the store ID for the store owner
        const [storeResult] = await new Promise((resolve, reject) => {
            db.query("SELECT id FROM stores WHERE owner_id = ?", [storeOwnerId], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return res.status(404).json({ message: "Store not found" });
                resolve(results);
            });
        });

        const storeId = storeResult.id;

        // Get ratings for the store
        const ratings = await new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    u.name AS user_name,
                    u.email AS user_email,
                    r.rating
                FROM ratings r
                JOIN users u ON r.user_id = u.id
                WHERE r.store_id = ?;
            `;
            db.query(ratingsQuery, [storeId], (err, ratingsResults) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(ratings);
                }
            });
        });

        // Get the average rating for the store
        const avgRating = await new Promise((resolve, reject) => {
            db.query("SELECT COALESCE(AVG(rating), 0) AS avg_rating FROM ratings WHERE store_id = ?", [storeId], (err, avgResult) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(avgResult[0].avg_rating || 0);
                }
            });
        });

        res.json({ ratings, avg_rating: avgRating });

    } catch (error) {
        console.error("Error fetching store ratings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
