import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Room from "../models/Room";
import type { Iuser } from "../models/User";

interface AuthRequest extends Request {
  user?: Iuser;
}

export const createRoom = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { roomName, language } = req.body;

    if (!roomName || !roomName.trim()) {
      res.status(400).json({ message: "Room name is required" });
      return;
    }

    if (!req.user?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const room = new Room({
      roomName: roomName.trim(),
      code: "",
      language: language || "javascript",
      createdBy: req.user._id,
      isActive: true,
    });
    await room.save();

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  },
);
