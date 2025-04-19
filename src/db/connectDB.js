// importing dependencies
import mongoose from "mongoose";

/**
 * @function connectDB
 * @description Asynchronously connects to MongoDB using Mongoose and logs the connection status.
 * @param {Object} request - The incoming request object (not used in this function).
 * @param {Object} response - The outgoing response object (not used in this function).
 * @returns {Promise<void>} - Resolves once the connection attempt is complete.
 */
export const connectDB = async (request, response) => {
    try {
        // Await the connection to MongoDB and store the connection result
        const connection = await mongoose.connect(process.env.MONGODB_URI);

        // Logging a success message once connected, showing the host of the MongoDB instance
        console.log(`MongoDB connected: ${connection.connection.host}`);

    } catch (error) {
        // If an error occurs during the connection, log the error message
        console.log("Error connecting to MongoDB", error.message);

        // Exiting the process with a failure code if the connection fails
        process.exit(1);
    }
};
