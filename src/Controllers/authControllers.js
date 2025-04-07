import { User } from '../Models/UserModel.js';
import { sendErrorResponse, sendSuccessResponse } from '../Utils/utils.js';

export const signup = async (request, response) => {
    const { fullName, email, password } = request.body;
    try {
        if (!fullName || !email || !password) {
            return sendErrorResponse(response, 400, "All fields are required");
        };

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendErrorResponse(response, 400, "Email is already in use");
        }
    } catch (error) {
        
    }
};

export const login = async (request, response) => {
    response.send("Login Route");
};

export const logout = async (request, response) => {
    response.send("Logout Route");
};