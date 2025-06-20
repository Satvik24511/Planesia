import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import {connectDB} from "./lib/db.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:"+PORT);
    connectDB();
})