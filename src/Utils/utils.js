// Importing Dependencies
import jwt from 'jsonwebtoken'; // For creating and verifying JWT tokens
import rateLimit from 'express-rate-limit'; // For limiting repeated requests to endpoints
import { User } from '../Models/UserModel.js'; // Importing User model for authentication

/**
 * Utility function to send consistent error responses
 * 
 * @param {object} response - Express response object
 * @param {number} status - HTTP status code (e.g., 400, 401, 500)
 * @param {string} message - Error message to return to the client
 */
export const sendErrorResponse = (response, status, message) =>
    response.status(status).json({ message });

/**
 * Utility function to send consistent success responses
 * 
 * @param {object} response - Express response object
 * @param {number} status - HTTP status code (e.g., 200, 201)
 * @param {string} message - Success message to return to the client
 * @param {object} [data={}] - Optional additional data to include in the response (default is an empty object)
 */
export const sendSuccessResponse = (response, status, message, data = {}) =>
    response.status(status).json({ message, ...data });

/**
 * Utility function to generate a 6-digit numeric verification code
 * 
 * @returns {string} - A stringified 6-digit number
 */
export const generateVerificationToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Utility function to generate a JWT token and set it as an HTTP-only cookie
 * 
 * @param {object} response - Express response object
 * @param {string} userId - Unique user ID to embed in the JWT
 * @returns {string} - The generated JWT token
 */
export const generateTokenAndSetCookie = (response, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token is valid for 7 days
    });

    // Set token in cookie with security settings
    response.cookie("token", token, {
        httpOnly: true, // Cookie not accessible via JavaScript
        secure: process.env.NODE_ENV === "production", // Secure in production only
        sameSite: "strict", // Protect against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry in milliseconds (7 days)
    });

    return token;
};

/**
 * Middleware to check if the user is authenticated
 * 
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {function} next - Express next middleware function
 */
export const isAuthenticated = async (request, response, next) => {
    try {
        const token = request.cookies.token; // Retrieve token from cookies

        if (!token) {
            return response.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user based on token's embedded userId
        const user = await User.findById(decoded.userId);

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // Attach user object to the request
        request.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Auth error:", error.message);
        return response.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

/**
 * Middleware to limit repeated login attempts
 * 
 * Protects against brute force attacks by limiting number of requests
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute window
    max: 5, // Limit each IP to 5 login attempts per window
    message: "Too many login attempts from this IP, please try again later.",
    standardHeaders: true, // Return rate limit info in standard headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});