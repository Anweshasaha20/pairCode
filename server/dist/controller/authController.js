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
exports.validateAuth = exports.githubCallback = exports.githubRedirect = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const githubRedirect = (req, res) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user`;
    res.redirect(url);
};
exports.githubRedirect = githubRedirect;
const githubCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    try { // exchange code for the access token from github
        const tokenRes = yield axios_1.default.post("https://github.com/login/oauth/access_token", {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }, {
            headers: { Accept: "application/json" }, // tells github to return json rather than url
        });
        const accessToken = tokenRes.data.access_token;
        // get user 
        const userRes = yield axios_1.default.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        console.log("GitHub user data:", userRes.data);
        // check if user already exists in our database
        let existingUser = yield User_1.default.findOne({ githubId: userRes.data.id.toString() });
        if (!existingUser) {
            existingUser = yield User_1.default.create({
                username: userRes.data.login,
                githubId: userRes.data.id.toString(),
                email: userRes.data.email,
                avatarUrl: userRes.data.avatar_url,
            });
        }
        // create jwt
        const secret = process.env.PASS_KEY;
        const token = jsonwebtoken_1.default.sign({ sub: existingUser._id.toString() }, secret, { expiresIn: "5h" });
        // setting cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect(`${process.env.CLIENT_URL}`);
    }
    catch (err) {
        console.error("GitHub OAuth error:", err);
        res.status(500).json({
            message: "GitHub authentication failed",
        });
    }
});
exports.githubCallback = githubCallback;
const validateAuth = (req, res) => {
    if (req.user) {
        res.status(200).json({
            message: "Authenticated",
            user: req.user,
        });
    }
    else {
        res.status(401).json({
            message: "Not authenticated",
        });
    }
};
exports.validateAuth = validateAuth;
