const jwt = require("jsonwebtoken");


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("🔍 Authorization Header:", authHeader); // Debugging

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Forbidden: No token provided." });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔍 Extracted Token:", token); // Debugging

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("🚨 JWT Verification Error:", err);
            return res.status(403).json({ error: "Invalid or expired token." });
        }
        req.user = user; // Attach user data
        next();
    });
};

module.exports = { authenticateToken };
