import bcrypt from 'bcryptjs';
import { User } from '../Models/UserModel.js';
import { generateVerificationToken, generateTokenAndSetCookie, sendErrorResponse, sendSuccessResponse } from '../Utils/utils.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../Mailtrap/emails.js';

export const signup = async (request, response) => {
    const { fullName, email, password } = request.body;
    try {
        if (!fullName || !email || !password) {
            return sendErrorResponse(response, 400, "All fields are required");
        };

        if (password.length < 6 || !/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
            return sendErrorResponse(response, 400, "Password must be at least 6 characters and contain at least one letter and one number.");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendErrorResponse(response, 400, "Email is already in use");
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();
        const user = new User({
            fullName, 
            email, 
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        await user.save();

        generateTokenAndSetCookie(response, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        return sendSuccessResponse(response, 201, "User has been created successfully", {
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
    response.send("Login Route");
};

export const logout = async (request, response) => {
    response.send("Logout Route");
};

