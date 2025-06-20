import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { email, password, retypePassword, name} = req.body;

    try {
        if(!email || !password || !retypePassword || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if(password !== retypePassword){
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newUser = await User.create({
            name,
            email,
            password
        });

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV==="production",
        })

        res.status(201).json({success: true, message: "User created successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if(password != user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV==="production",
        })

        res.status(200).json({success: true, message: "User logged in successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({success: true, message: "User logged out successfully" });
}
