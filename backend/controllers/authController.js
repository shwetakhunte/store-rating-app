const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.signup = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { name, email, password: hashedPassword, address, role };

        User.createUser(newUser, (err, result) => {
            if (err) {
                if (err.message === "Email already in use") {
                    return res.status(400).json({ message: "Email already in use." });
                }
                return res.status(500).json({ message: "Something went wrong. Please try again." });
            }

            res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};
