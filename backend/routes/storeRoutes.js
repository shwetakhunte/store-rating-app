const express = require("express");
const db = require("../config/db"); // Ensure db is properly configured
const router = express.Router();
//const bcrypt = require("bcryptjs");

//const { authenticateToken } = require("../middleware/authMiddleware"); // Ensure user is authenticated






// Store Owner Dashboard: View Ratings & Average Rating
router.get("/api/store-owner/dashboard", async (req, res) => {
    try {
        const storeOwnerId = req.query.user_id; // Get from query parameter

        if (!storeOwnerId) {
            return res.status(400).json({ error: "Missing store owner ID" });
        }

        // Fetch store owner's name
        const storeQuery = `SELECT name FROM stores WHERE owner_id = ? LIMIT 1;`;
        const [storeResult] = await db.promise().execute(storeQuery, [storeOwnerId]);
        const storeName = storeResult.length > 0 ? storeResult[0].name : "Unknown Store";

        // Fetch ratings
        const ratingsQuery = `
            SELECT 
                r.rating, 
                u.name AS user_name, 
                u.email AS user_email
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            WHERE s.owner_id = ?;
        `;
        const [ratings] = await db.promise().execute(ratingsQuery, [storeOwnerId]);

        // Fetch average rating
        const avgRatingQuery = `
            SELECT AVG(r.rating) AS averageRating 
            FROM ratings r
            JOIN stores s ON r.store_id = s.id
            WHERE s.owner_id = ?;
        `;
        const [avgRatingResult] = await db.promise().execute(avgRatingQuery, [storeOwnerId]);
        const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].averageRating || 0 : 0;

        // Send response
        res.json({ storeName, ratings, averageRating });
    } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
