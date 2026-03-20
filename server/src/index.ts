import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import { setupWebSocket } from "./utils/wsServer";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);

//websocket
setupWebSocket(server);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
