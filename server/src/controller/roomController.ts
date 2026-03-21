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
      users: [req.user._id],
      isActive: true,
    });
    await room.save();

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  },
);

export const joinRoom = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { roomId } = req.body;
  
  if (!roomId) {
    res.status(400).json({ message: "Room ID is required" });
    return;
  }

  const room = await Room.findById(roomId);

  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    { $addToSet: { users: req.user?._id}},
    { new: true },
  );

  if (!updatedRoom) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  res.status(200).json({
    message: "Joined room successfully",
    room: updatedRoom,
  });
});
