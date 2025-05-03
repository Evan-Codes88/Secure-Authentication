// index.js

// Importing dependencies
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/db/connectDB.js';
import authRoutes from './src/Routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Authentication routes (signup, login, logout, etc.)
app.use("/api/auth", authRoutes);

// Start the server is not in test
if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || 8880, () => {
      connectDB();
      console.log("Server is running");
    });
  }

// Export app for testing purposes
export default app;
