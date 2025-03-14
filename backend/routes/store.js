const express = require("express");
const db = require("../config/db");
const router = express.Router();

// ✅ Fetch all stores
router.get("/api/stores", (req, res) => {
    const query = `
    SELECT 
        stores.id, 
        stores.name, 
        stores.address, 
        COALESCE(AVG(ratings.rating), 0) AS overall_rating
    FROM stores
    LEFT JOIN ratings ON stores.id = ratings.store_id
    GROUP BY stores.id
`;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(results);
    });
});



// 🏪 Register a Store
router.post("/register", (req, res) => {
    const { name, address, owner_id } = req.body;

    if (!name || !address) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const query = "INSERT INTO stores (name, address, owner_id) VALUES (?, ?, ?)";
    db.query(query, [name, address, owner_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(201).json({ message: "Store registered successfully!" });
    });
});

module.exports = router;
