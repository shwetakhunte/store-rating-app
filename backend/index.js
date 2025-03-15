const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require('./routes/auth'); // Make sure this matches your file name
const storeRoutes = require("./routes/store"); // Import store routes
const ratingRoutes = require("./routes/rating");
const adminRoutes = require("./routes/admin");
const storeOwnerRoutes = require("./routes/storeRoutes");


require("dotenv").config();

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:3000",  // Allow frontend access
    credentials: true,  // Allow cookies & headers
    methods: "GET,POST,PUT,DELETE",  // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization" // Allowed headers
})); // Allow frontend to access backend


app.use(express.json()); // Parse JSON request body

// Use API routes
app.use("/api", authRoutes);

app.use("/", storeRoutes); 
app.use("/", ratingRoutes);
app.use("/", adminRoutes);
//app.use("/", storeowner);
app.use("/", storeOwnerRoutes); 

// Default test route
app.get("/", (req, res) => {
    res.send("Store API is running...");
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
