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
exports.joinRoom = exports.createRoom = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Room_1 = __importDefault(require("../models/Room"));
exports.createRoom = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { roomName, language } = req.body;
    if (!roomName || !roomName.trim()) {
        res.status(400).json({ message: "Room name is required" });
        return;
    }
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const room = new Room_1.default({
        roomName: roomName.trim(),
        code: "",
        language: language || "javascript",
        createdBy: req.user._id,
        users: [req.user._id],
        isActive: true,
    });
    yield room.save();
    res.status(201).json({
        message: "Room created successfully",
        room,
    });
}));
exports.joinRoom = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { roomId } = req.body;
    if (!roomId) {
        res.status(400).json({ message: "Room ID is required" });
        return;
    }
    const room = yield Room_1.default.findById(roomId);
    if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
    }
    const updatedRoom = yield Room_1.default.findByIdAndUpdate(roomId, { $addToSet: { users: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id } }, { new: true });
    if (!updatedRoom) {
        res.status(404).json({ message: "Room not found" });
        return;
    }
    res.status(200).json({
        message: "Joined room successfully",
        room: updatedRoom,
    });
}));
