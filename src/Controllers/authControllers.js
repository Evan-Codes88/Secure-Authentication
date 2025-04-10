import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { User } from '../Models/UserModel.js';
import { generateVerificationToken, generateTokenAndSetCookie, sendErrorResponse, sendSuccessResponse } from '../Utils/utils.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../Mailtrap/emails.js';

export const signup = async (request, response) => {
    const { fullName, email, password } = request.body;
    try {
        if (!fullName || !email || !password) {
            return sendErrorResponse(response, 400, "All fields are required");
        }

        if (password.length < 6 || !/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
            return sendErrorResponse(response, 400, "Password must be at least 6 characters and contain at least one letter and one number.");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendErrorResponse(response, 400, "Email is already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();
        const user = new User({
            fullName, 
            email, 
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
            twoFactorEnabled: false // explicitly set
        });

        await user.save();

        generateTokenAndSetCookie(response, user._id);
        await sendVerificationEmail(user.email, verificationToken);

        return sendSuccessResponse(response, 201, "User created. Please verify your email and set up 2FA to continue.", {
            success: true,
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log("Error sending email:", error.message);
        return sendErrorResponse(response, 500, `Failed to send verification email: ${error.message}`);
    }
};

export const verifyEmail = async (request, response) => {
    const { code } = request.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if(!user) {
            return sendErrorResponse(response, 400, "Invalid or expired verificaion code");
        };

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.fullName);

        return sendSuccessResponse(response, 200, "Email verified successfully", {
            success: true,
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    
    } catch (error) {
        console.log("Error in verifyEmail:", error.message);
        return sendErrorResponse(response, 500, "Email verification failed");
    }
};

export const login = async (request, response) => {
    const { email, password, twoFactorCode } = request.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return sendErrorResponse(response, 400, "Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendErrorResponse(response, 400, "Invalid credentials");
        }

        // ✅ Check if email is verified first (optional, if your flow includes this)
        if (!user.isVerified) {
            return sendErrorResponse(response, 403, "Please verify your email before logging in");
        }

        // ✅ Force 2FA setup
        if (!user.twoFactorEnabled) {
            return sendErrorResponse(response, 403, "2FA setup is required before you can log in");
        }

        // ✅ 2FA code check
        if (!twoFactorCode) {
            return sendErrorResponse(response, 400, "2FA code required");
        }

        const isTokenValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: twoFactorCode,
            window: 1
        });

        if (!isTokenValid) {
            return sendErrorResponse(response, 400, "Invalid 2FA code");
        }

        generateTokenAndSetCookie(response, user._id);

        user.lastLogin = new Date();
        await user.save();

        return sendSuccessResponse(response, 200, "Logged in successfully", {
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.log("Error in login ", error);
        return sendErrorResponse(response, 400, "Login error");
    }
};

export const logout = async (request, response) => {
    response.clearCookie("token");
    return sendSuccessResponse(response, 200, "Logged Out Successfully")
};

export const setup2FA = async (request, response) => {
    const user = await User.findById(request.user._id);

    const secret = speakeasy.generateSecret({
        name: `YourApp (${user.email})`
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
        if (err) return sendErrorResponse(response, 500, "Failed to generate QR code");
        return sendSuccessResponse(response, 200, "2FA setup successful", {
            qrCodeUrl: dataUrl,
            secret: secret.base32
        });
    });
};

export const verify2FACode = async (request, response) => {
    const { token } = request.body;
    const user = await User.findById(request.user._id);

    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token
    });

    if (!verified) {
        return sendErrorResponse(response, 400, "Invalid 2FA code");
    }

    user.twoFactorEnabled = true;
    await user.save();

    return sendSuccessResponse(response, 200, "2FA has been enabled successfully");
};