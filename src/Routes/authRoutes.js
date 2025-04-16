/**
 * @file Defines authentication-related API routes including signup, login, logout, email verification, and 2FA.
 */

// Import Express to create router
import express from 'express';

// Import controller functions handling authentication logic
import {
    signup,
    login,
    logout,
    verifyEmail,
    setup2FA,
    verify2FACode,
} from '../Controllers/authControllers.js';

// Import middleware functions for authentication and rate limiting
import { isAuthenticated, loginLimiter } from '../Utils/utils.js';

// Initialize a new Express router
const router = express.Router();

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post("/signup", signup);

/**
 * @route POST /api/auth/login
 * @desc Log in an existing user with rate limiting
 * @access Public
 */
router.post("/login", loginLimiter, login);

/**
 * @route POST /api/auth/logout
 * @desc Log out the currently authenticated user
 * @access Public
 */
router.post("/logout", logout);

/**
 * @route POST /api/auth/verify-email
 * @desc Verify user's email address using a code or token
 * @access Public
 */
router.post("/verify-email", verifyEmail);

/**
 * @route POST /api/auth/2fa/setup
 * @desc Set up Two-Factor Authentication (2FA) for a user
 * @access Private (Authenticated users only)
 */
router.post('/2fa/setup', isAuthenticated, setup2FA);

/**
 * @route POST /api/auth/2fa/verify
 * @desc Verify submitted 2FA code for authentication
 * @access Private (Authenticated users only)
 */
router.post('/2fa/verify', isAuthenticated, verify2FACode);

/**
 * Export the configured router to be used in the main application
 */
export default router;
