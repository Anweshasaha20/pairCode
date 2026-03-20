import { Response, Request } from "express";
import { configDotenv } from "dotenv";
import user from '../models/User'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

configDotenv();

interface authRequest extends Request{
    user ?: any;
}
const secret = process.env.PASS_KEY as string;

export const register = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({
                message: "Please provide all the details"
            })
            return;
        }

        let userdetail = await user.findOne({
            email: email
        })

        if (userdetail) {
            res.status(400).json({
                message: "User already exists with this email id"
            })
            return;
        }

        userdetail = await user.findOne({
            username: username
        })
        
        if (userdetail) {
            res.status(400).json({
                message: "User already exists with this username"
            })
            return;
        }

        await user.create({
            username: username,
            password: await bcrypt.hash(password, 10),
            email: email
        })

        const token = jwt.sign({ sub: email }, secret, { expiresIn: "5h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,      // Must be true for HTTPS (Render)
            sameSite: "none",  // Must be "none" for cross-site cookies
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(201).json({
            message: "User registered successfully"
        })
        return;
    } catch (e) {
        res.status(500).json({
            message: "Error in registering user"
        })
    }
})

//----------------------------------------------------------------------------------------------------------------------------------------

export const login = asyncHandler(async (req: authRequest, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            message: "Please provide all the details"
        })
        return;
    }
    const userdetail = await user.findOne({
        email: email
    })
    if (!userdetail) {
        res.status(400).json({
            message: "User not found with this email id . Please register first"
        })
        return;
    }
    const isMatch = await bcrypt.compare(password, userdetail.password);
    if (!isMatch) {
        res.status(400).json({
            message: "Password is incorrect"
        })
        return;
    }
    const token = jwt.sign({ sub: email }, secret, { expiresIn: "5h" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,      // Must be true for HTTPS (Render)
        sameSite: "none",  // Must be "none" for cross-site cookies
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    res.status(200).json({
        message: "Login Successful"
    })
    return;
})