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
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: { type: String, trime: true },
    verificationTokenExpiresAt: Date,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: String,
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);