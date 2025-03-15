const express = require("express");
const db = require("../config/db"); // Ensure db connection
const router = express.Router();

// Store Owner Dashboard: View Ratings & Average Rating
router.get("/api/store-owner/dashboard", async (req, res) => {
    try {
        const storeOwnerId = req.query.user_id; // Get user ID from query params

        // Validate if user_id is provided
        if (!storeOwnerId) {
            return res.status(400).json({ error: "Missing store owner ID" });
        }

        console.log("Store Owner ID Received:", storeOwnerId); // Debugging

        // Fetch store owner's name
        const storeQuery = `SELECT name FROM stores WHERE owner_id = ? LIMIT 1;`;
        const [storeResult] = await db.promise().execute(storeQuery, [storeOwnerId]);

        if (storeResult.length === 0) {
            return res.status(404).json({ error: "Store not found for this owner" });
        }

        const storeName = storeResult[0].name;
        console.log("Store Name:", storeName); // Debugging

        // Fetch ratings with user info
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
        console.log("Ratings:", ratings); // Debugging

        // Fetch average rating
        const avgRatingQuery = `
            SELECT COALESCE(AVG(r.rating), 0) AS averageRating 
            FROM ratings r
            JOIN stores s ON r.store_id = s.id
            WHERE s.owner_id = ?;
        `;
        const [avgRatingResult] = await db.promise().execute(avgRatingQuery, [storeOwnerId]);
        const averageRating = parseFloat(avgRatingResult[0].averageRating).toFixed(1);

        console.log("Average Rating:", averageRating); // Debugging

        // Send response
        res.json({ storeName, ratings, averageRating });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
