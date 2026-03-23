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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const getJwtSecret = () => {
    const secret = process.env.PASS_KEY;
    if (!secret) {
        throw new Error("PASS_KEY is missing in environment");
    }
    return secret;
};
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const token = req.cookies.token; // this throws error if req.cookies is undefined
    try {
        const secret = getJwtSecret();
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token; // this checks if req.cookies is undefined or not if undeined it doesnt throw err
        //rather it returns undefined
        if (!token) {
            res.status(401).json({
                message: "Please register to proceed",
            });
            return;
        }
        // now token is present for sure
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const userid = decoded.sub;
        const userdetail = yield User_1.default.findById(userid);
        if (!userdetail) {
            res.status(401).json({
                message: "User not found",
            });
            return;
        }
        else {
            req.user = userdetail;
            next();
            return;
        }
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error in verifying token";
        const statusCode = errorMessage.includes("PASS_KEY") ? 500 : 401;
        res.status(statusCode).json({
            message: errorMessage,
        });
        return;
    }
});
exports.auth = auth;
