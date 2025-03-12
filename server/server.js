const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const friendRoutes = require("./routes/friends");
const chatRoutes = require("./routes/chat");
const adminRoutes = require("./routes/admin");

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));  // Handle JSON requests
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" })); // Enable CORS

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);

// Connect to MongoDB
connectDB()
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// Default Route (Check if server is running)
app.get("/", (req, res) => {
    res.send("🚀 Server is running!");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
