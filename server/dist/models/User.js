"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    githubId: { type: String, required: false },
    avatarUrl: { type: String, required: false }
}, {
    timestamps: true
});
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
