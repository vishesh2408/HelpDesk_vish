import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimiter from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import pool from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // keep CORS open
app.use(express.json());
app.use(rateLimiter);
// Removed duplicate declaration of PORT

// Test DB connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection failed", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

// Error handler (uniform error format)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
