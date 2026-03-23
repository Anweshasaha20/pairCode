"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    roomName: { type: String, default: "" },
    code: { type: String, default: "" },
    language: { type: String, default: "javascript" },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    users: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Room", roomSchema);
