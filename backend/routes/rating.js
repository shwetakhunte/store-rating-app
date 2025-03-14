const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Get rating by user for a specific store
router.get("/api/ratings/:storeId/:userId", (req, res) => {
    const { storeId, userId } = req.params;
    
    db.query(
        "SELECT rating FROM ratings WHERE store_id = ? AND user_id = ?",
        [storeId, userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results.length ? results[0] : { rating: null });
        }
    );
});


// Submit or update rating
router.post("/api/ratings", (req, res) => {
    const { store_id, user_id, rating } = req.body;

    // Check if rating already exists
    db.query(
        "SELECT * FROM ratings WHERE store_id = ? AND user_id = ?",
        [store_id, user_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length) {
                // Update existing rating
                db.query(
                    "UPDATE ratings SET rating = ? WHERE store_id = ? AND user_id = ?",
                    [rating, store_id, user_id],
                    (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Rating updated successfully" });
                    }
                );
            } else {
                // Insert new rating
                db.query(
                    "INSERT INTO ratings (store_id, user_id, rating) VALUES (?, ?, ?)",
                    [store_id, user_id, rating],
                    (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Rating submitted successfully" });
                    }
                );
            }
        }
    );
});

module.exports = router;
