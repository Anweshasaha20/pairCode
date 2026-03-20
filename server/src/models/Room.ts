import mongoose, { Document } from "mongoose";

export interface IRoom extends Document {
  roomId: string;
  code: string;
  language: string;
  createdBy?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const roomSchema = new mongoose.Schema<IRoom>(
  {
    roomId: { type: String, unique: true },
    code: { type: String, default: "" },
    language: { type: String, default: "javascript" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model<IRoom>("Room", roomSchema);
