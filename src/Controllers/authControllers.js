import bcrypt from 'bcryptjs';
import { User } from '../Models/UserModel.js';
import { generateVerificationToken, sendErrorResponse, sendSuccessResponse } from '../Utils/utils.js';

export const signup = async (request, response) => {
    const { fullName, email, password } = request.body;
    try {
        if (!fullName || !email || !password) {
            return sendErrorResponse(response, 400, "All fields are required");
        };

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

        return sendSuccessResponse(response, 201, "User has been created successfully", {
            success: true,
            user: {
                ...user._doc,
                password: undefined,
            }
        });
        

    } catch (error) {
        return sendErrorResponse(response, 404, "Signup Failed");
    }
};

export const login = async (request, response) => {
    response.send("Login Route");
};

export const logout = async (request, response) => {
    response.send("Logout Route");
};