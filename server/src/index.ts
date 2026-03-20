import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.get("/" , (req ,res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

