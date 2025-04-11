// Importing Dependencies
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../Models/UserModel.js';

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


/** Utility functions to check if authenticated
 * 
 */
export const isAuthenticated = async (request, response, next) => {
    try {
        const token = request.cookies.token;

        if (!token) {
            return response.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        request.user = user; // attach user object to request
        next(); // proceed to the next middleware or route handler
    } catch (error) {
        console.error("Auth error:", error.message);
        return response.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

/** Utility function to Encrypt the 2FA Secret
 * 
 */

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012';
const IV_LENGTH = 16;

if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 characters long for AES-256-CBC.");
}

export const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text) => {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
