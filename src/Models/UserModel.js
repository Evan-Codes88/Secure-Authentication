/**
 * @file Defines the Mongoose schema and model for user accounts,
 * including fields for authentication, email verification, and 2FA.
 */

import mongoose from 'mongoose';

/**
 * @constant userSchema
 * @type {mongoose.Schema}
 * @description Mongoose schema defining structure of a User document
 */
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
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
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
    verificationToken: {
        type: String,
        trim: true,
    },
    verificationTokenExpiresAt: {
        type: Date,
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },
    twoFactorSecret: {
        type: String,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Enable virtuals in JSON output
    toObject: { virtuals: true }, // Enable virtuals in object output
});

/**
 * @constant User
 * @type {mongoose.Model}
 * @description Mongoose model compiled from userSchema
 */
export const User = mongoose.model("User", userSchema);
