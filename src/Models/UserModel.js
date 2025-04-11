import mongoose from 'mongoose';
import { encrypt, decrypt } from '../Utils/utils.js'

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
    verificationToken: { type: String, trim: true },
    verificationTokenExpiresAt: Date,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecretEncrypted: String,
}, { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
 });

userSchema.virtual('twoFactorSecret')
    .get(function () {
        if (!this.twoFactorSecretEncrypted) return null;
        try {
            return decrypt(this.twoFactorSecretEncrypted);
        } catch (err) {
            console.error('Decryption error:', err.message);
            return null;
        }
    })
    .set(function (value) {
        this.twoFactorSecretEncrypted = encrypt(value);
    });

export const User = mongoose.model("User", userSchema);