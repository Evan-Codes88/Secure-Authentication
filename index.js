/**
 * @file Entry point of the application.
 * Initializes the Express server, sets up middleware, routes, and connects to the database.
 */

// Importing dependencies
import express from 'express'; // Express framework for building APIs
import dotenv from 'dotenv'; // Loads environment variables from .env file
import cookieParser from 'cookie-parser'; // Parses cookies from incoming requests

// Importing local modules
import { connectDB } from './src/db/connectDB.js'; // Function to connect to the database
import authRoutes from './src/Routes/authRoutes.js'; // Authentication-related routes

// Load environment variables
dotenv.config();

// Initialize the Express application
const app = express();

/**
 * @constant {number} PORT - Port number the server will listen on
 */
const PORT = process.env.PORT || 8880;

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

/**
 * @route /api/auth
 * Authentication routes (signup, login, logout, etc.)
 */
app.use("/api/auth", authRoutes);

/**
 * Start the server and establish database connection
 * @function
 * @listens app.listen
 */
app.listen(PORT, () => {
    connectDB(); // Establish connection to the database
    console.log("Server is running on port:", PORT);
});
