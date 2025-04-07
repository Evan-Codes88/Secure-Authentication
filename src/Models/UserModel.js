import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full Name field is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email field is required"],
        unique: [true, "Email is already in use"],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password field is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Password must be at least 6 characters and contain at least one letter and one number"],
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: { type: String, trim: true },
    resetPasswordExpiresAt: Date,
    verificationToken: { type: String, trime: true },
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

export const user = mongoose.model("User", userSchema);