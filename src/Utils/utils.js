// Importing Dependencies
import jwt from 'jsonwebtoken';

/**
 * Utility function to send error responses consistently
 * 
 * @param {object} response - Express response object
 * @param {number} status - HTTP status code (e.g., 400, 401, 500)
 * @param {string} message - Error message to return to the client
 */
export const sendErrorResponse = (response, status, message) =>
    response.status(status).json({ message });


/**
 * Utility function to send success responses consistently
 * 
 * @param {object} response - Express response object
 * @param {number} status - HTTP status code (e.g., 200, 201)
 * @param {string} message - Success message to return to the client
 * @param {object} [data={}] - Optional additional data to include in the response (default is an empty object)
 */
export const sendSuccessResponse = (response, status, message, data = {}) =>
    response.status(status).json({ message, ...data });


/** Utility function to generate verification code
 * 
 */
export const generateVerificationToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


/** Utility function to generate token and set cookie
 * 
 */
export const generateTokenAndSetCookie = (response, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    response.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};