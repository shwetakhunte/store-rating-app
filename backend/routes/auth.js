const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();
require("dotenv").config();
const { authenticateToken } = require("../middleware/authMiddleware"); // Ensure user is authenticated

// 🛠 Register Route (With Store Owner Logic)
router.post("/register", async (req, res) => {
    const { name, email, password, address, role } = req.body;

    // Validate role (Allow only "user" or "store_owner")
    const validRoles = ["user", "store_owner"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role selected" });
    }

    // Check if email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length > 0) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        db.query(
            "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, address, role],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Error inserting user" });

                // If store owner, notify admin (optional)
                if (role === "store_owner") {
                    console.log("🛒 New Store Owner Registered - Awaiting Approval:", email);
                }

                res.status(201).json({ message: "User registered successfully", role });
            }
        );
    });
});

// 🛠 Login Route (With Store Owner Handling)
router.post("/login", (req, res) => {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            console.log("No user found with email:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = results[0];
        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        console.log("User role:", user.role); // Debugging role

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
});


// Update Password Route
router.post("/update-password", authenticateToken, async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id; // ✅ Extract from token instead of req.body

        if (!userId) {
            return res.status(400).json({ error: "User ID not found in token." });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password in the database
        const updateQuery = `UPDATE users SET password = ? WHERE id = ?`;
        await db.promise().execute(updateQuery, [hashedPassword, userId]);

        res.json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
