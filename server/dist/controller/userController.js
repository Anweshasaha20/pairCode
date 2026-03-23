"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
const getJwtSecret = () => {
    const secret = process.env.PASS_KEY;
    if (!secret) {
        throw new Error("PASS_KEY is missing in environment");
    }
    return secret;
};
exports.register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secret = getJwtSecret();
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({
                message: "Please provide all the details",
            });
            return;
        }
        let userdetail = yield User_1.default.findOne({
            email: email,
        });
        if (userdetail) {
            res.status(400).json({
                message: "User already exists with this email id",
            });
            return;
        }
        userdetail = yield User_1.default.findOne({
            username: username,
        });
        if (userdetail) {
            res.status(400).json({
                message: "User already exists with this username",
            });
            return;
        }
        const createdUser = yield User_1.default.create({
            username: username,
            password: yield bcrypt_1.default.hash(password, 10),
            email: email,
        });
        const token = jsonwebtoken_1.default.sign({ sub: createdUser._id.toString() }, secret, {
            expiresIn: "5h",
        });
        res.cookie("token", token, cookieOptions);
        res.status(201).json({
            message: "User registered successfully",
        });
        return;
    }
    catch (e) {
        res.status(500).json({
            message: "Error in registering user",
        });
    }
}));
//----------------------------------------------------------------------------------------------------------------------------------------
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const secret = getJwtSecret();
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            message: "Please provide all the details",
        });
        return;
    }
    const userdetail = yield User_1.default.findOne({
        email: email,
    });
    if (!userdetail) {
        res.status(400).json({
            message: "User not found with this email id . Please register first",
        });
        return;
    }
    const isMatch = yield bcrypt_1.default.compare(password, ((_a = userdetail.password) === null || _a === void 0 ? void 0 : _a.toString()) || "");
    if (!isMatch) {
        res.status(400).json({
            message: "Password is incorrect",
        });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ sub: userdetail._id.toString() }, secret, {
        expiresIn: "5h",
    });
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
        message: "Login Successful",
    });
    return;
}));
exports.logout = (0, express_async_handler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
    });
    res.status(200).json({
        message: "Logout successful",
    });
}));
