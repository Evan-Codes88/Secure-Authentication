import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/db/connectDB.js';

import authRoutes from './src/Routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8880;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port: ", PORT);
});