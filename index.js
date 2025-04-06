import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/db/connectDB.js';

import authRoutes from './src/Routes/authRoutes.js';

dotenv.config();

const app = express();

app.get("/", (request, response) => {
    response.send("Hello World");
});

app.use("/api/auth", authRoutes);

app.listen(8880, () => {
    connectDB();
    console.log("Server is running on port 8880");
});