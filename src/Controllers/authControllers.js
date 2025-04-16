/**
 * @file This file contains the authentication-related functions for user signup, login, 2FA, etc.
 */
import bcrypt from 'bcryptjs'; // Importing bcryptjs library for hashing and comparing passwords
import speakeasy from 'speakeasy'; // Importing speakeasy library for generating and validating 2FA tokens
import qrcode from 'qrcode'; // Importing qrcode library to generate QR codes for 2FA setup
import { User } from '../Models/UserModel.js'; // Importing the User model from the Models folder to interact with the user data in the database
import { generateVerificationToken, generateTokenAndSetCookie, sendErrorResponse, sendSuccessResponse } from '../Utils/utils.js'; // Importing utility functions for generating tokens, sending success/error responses, and managing cookies
import { sendVerificationEmail, sendWelcomeEmail } from '../Mailtrap/emails.js'; // Importing email sending functions for verification and welcome emails from Mailtrap

/**
 * @function signup
 * @description Registers a new user, validates input, hashes the password, and sends a verification email.
 * @param {Object} request - The incoming request object containing user data.
 * @param {Object} response - The outgoing response object to return the result.
 * @returns {Promise<void>} - Resolves once the user is created and the verification email is sent.
 */
export const signup = async (request, response) => {
    const { fullName, email, password } = request.body;
    try {
        // Validate if all required fields are provided
        if (!fullName || !email || !password) {
            return sendErrorResponse(response, 400, "All fields are required");
        }

        // Validate password strength (at least 6 characters, contains at least one letter and one number)
        if (password.length < 6 || !/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
            return sendErrorResponse(response, 400, "Password must be at least 6 characters and contain at least one letter and one number.");
        }

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendErrorResponse(response, 400, "Email is already in use");
        }

        // Hash the user's password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token and prepare the user object
        const verificationToken = generateVerificationToken();
        const user = new User({
            fullName, 
            email, 
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
            twoFactorEnabled: false // explicitly set
        });

        // Save the user in the database
        await user.save();

        // Generate token and set a cookie for session management
        generateTokenAndSetCookie(response, user._id);

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        return sendSuccessResponse(response, 201, "User created. Please verify your email and set up 2FA to continue.", {
            success: true,
            user: {
                ...user._doc,
                password: undefined, // Hide password field in response
            }
        });

    } catch (error) {
        console.log("Error sending email:", error.message);
        return sendErrorResponse(response, 500, `Failed to send verification email: ${error.message}`);
    }
};

/**
 * @function verifyEmail
 * @description Verifies a user's email using a verification token and sends a welcome email.
 * @param {Object} request - The incoming request object containing the verification code.
 * @param {Object} response - The outgoing response object to return the result.
 * @returns {Promise<void>} - Resolves once the email is verified and a welcome email is sent.
 */
export const verifyEmail = async (request, response) => {
    const { code } = request.body;
    try {
        // Find the user based on the verification code and token expiry
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        // If the user is not found or the token is expired
        if(!user) {
            return sendErrorResponse(response, 400, "Invalid or expired verification code");
        }

        // Update user verification status and clear the verification token
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        // Save the updated user
        await user.save();

        // Send a welcome email to the user
        await sendWelcomeEmail(user.email, user.fullName);

        return sendSuccessResponse(response, 200, "Email verified successfully", {
            success: true,
            user: {
                ...user._doc,
                password: undefined, // Hide password field in response
            }
        });
    
    } catch (error) {
        console.log("Error in verifyEmail:", error.message);
        return sendErrorResponse(response, 500, "Email verification failed");
    }
};

/**
 * @function login
 * @description Logs a user in by validating their credentials and verifying 2FA if enabled.
 * @param {Object} request - The incoming request object containing login credentials and 2FA code.
 * @param {Object} response - The outgoing response object to return the result.
 * @returns {Promise<void>} - Resolves once the user is logged in and the session is established.
 */
export const login = async (request, response) => {
    const { email, password, twoFactorCode } = request.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return sendErrorResponse(response, 400, "Invalid credentials");
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendErrorResponse(response, 400, "Invalid credentials");
        }

        // Ensure the user's email is verified before login
        if (!user.isVerified) {
            return sendErrorResponse(response, 403, "Please verify your email before logging in");
        }

        // Ensure that 2FA is enabled for the user
        if (!user.twoFactorEnabled) {
            return sendErrorResponse(response, 403, "2FA setup is required before you can log in");
        }

        // Validate the provided 2FA code
        if (!twoFactorCode) {
            return sendErrorResponse(response, 400, "2FA code required");
        }

        // Verify the 2FA code using the secret stored for the user
        const isTokenValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: twoFactorCode,
            window: 1
        });

        if (!isTokenValid) {
            return sendErrorResponse(response, 400, "Invalid 2FA code");
        }

        // Generate token and set a cookie for session management
        generateTokenAndSetCookie(response, user._id);

        // Update the user's last login timestamp and save
        user.lastLogin = new Date();
        await user.save();

        return sendSuccessResponse(response, 200, "Logged in successfully", {
            user: {
                ...user._doc,
                password: undefined, // Hide password field in response
            },
        });

    } catch (error) {
        console.log("Error in login ", error);
        return sendErrorResponse(response, 400, "Login error");
    }
};

/**
 * @function logout
 * @description Logs a user out by clearing their session cookie.
 * @param {Object} request - The incoming request object (not used in this function).
 * @param {Object} response - The outgoing response object to return the result.
 * @returns {Promise<void>} - Resolves once the user has been logged out.
 */
export const logout = async (request, response) => {
    // Clear the session cookie to log out the user
    response.clearCookie("token");
    return sendSuccessResponse(response, 200, "Logged Out Successfully")
};

/**
 * @function setup2FA
 * @description Sets up 2FA for a user by generating a secret and creating a QR code.
 * @param {Object} request - The incoming request object (contains authenticated user).
 * @param {Object} response - The outgoing response object to return the result.
 * @returns {Promise<void>} - Resolves once the QR code for 2FA setup is generated.
 */
export const setup2FA = async (request, response) => {
    const user = await User.findById(request.user._id);

    // Generate a secret key for 2FA
    const secret = speakeasy.generateSecret({
        name: `YourApp (${user.email})`
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate a QR code for the user to scan in their 2FA app
    qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
        if (err) return sendErrorResponse(response, 500, "Failed to generate QR code");
        return sendSuccessResponse(response, 200, "2FA setup successful", {
            qrCodeUrl: dataUrl,
            secret: secret.base32
        });
    });
};

/**
 * @function verify2FACode
 * @description Verifies a 2FA code entered by the user.
 * @param {Object} request - The incoming request object containing the 2FA token.
 * @param {Object} response - The outgoing response object to return the result.
 * @returns {Promise<void>} - Resolves once 2FA is verified and enabled.
 */
export const verify2FACode = async (request, response) => {
    const { token } = request.body;
    const user = await User.findById(request.user._id);

    // Verify the entered 2FA token
    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token
    });

    if (!verified) {
        return sendErrorResponse(response, 400, "Invalid 2FA code");
    }

    // Enable 2FA for the user and save the state
    user.twoFactorEnabled = true;
    await user.save();

    return sendSuccessResponse(response, 200, "2FA has been enabled successfully");
};
