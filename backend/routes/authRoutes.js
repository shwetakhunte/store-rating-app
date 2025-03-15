const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// User Registration Route
router.post("/register", async (req, res) => {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        db.query(
            "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, address, role],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Error inserting user", error: err });
                }
                res.status(201).json({ message: "User registered successfully" });
            }
        );
    });
});

// User Login Route
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        // const token = jwt.sign(
        //     { id: user.id, role: user.role },
        //     process.env.JWT_SECRET,
        //     { expiresIn: "1h" }
        // );

        const secretKey = process.env.JWT_SECRET || "default_secret_key"; // Fallback key
        const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: "1h" });

        //res.json({ token, user: { id: user.id, email: user.email, role: user.role } });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role  // Ensure this is correctly returned
            }
        });
    });
});

module.exports = router;
