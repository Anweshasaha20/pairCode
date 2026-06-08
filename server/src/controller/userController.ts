import { Response, Request } from "express";
import user from "../models/User";
import type { Iuser } from "../models/User";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {languageMap} from "../config/data";
import axios from "axios";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

interface AuthRequest extends Request {
  user?: Iuser;
}

const getJwtSecret = () => {
  const secret = process.env.PASS_KEY;
  if (!secret) {
    throw new Error("PASS_KEY is missing in environment");
  }
  return secret;
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    const secret = getJwtSecret();
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      res.status(400).json({
        message: "Please provide all the details",
      });
      return;
    }

    let userdetail = await user.findOne({
      email: email,
    });

    if (userdetail) {
      res.status(400).json({
        message: "User already exists with this email id",
      });
      return;
    }

    userdetail = await user.findOne({
      username: username,
    });

    if (userdetail) {
      res.status(400).json({
        message: "User already exists with this username",
      });
      return;
    }

    const createdUser = await user.create({
      username: username,
      password: await bcrypt.hash(password, 10),
      email: email,
    });

    const token = jwt.sign({ sub: createdUser._id.toString() }, secret, {
      expiresIn: "5h",
    });

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User registered successfully",
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: "Error in registering user",
    });
  }
});

//----------------------------------------------------------------------------------------------------------------------------------------

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const secret = getJwtSecret();
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      message: "Please provide all the details",
    });
    return;
  }
  const userdetail = await user.findOne({
    email: email,
  });
  if (!userdetail) {
    res.status(400).json({
      message: "User not found with this email id . Please register first",
    });
    return;
  }
  const isMatch = await bcrypt.compare(password, userdetail.password?.toString() || "");
  if (!isMatch) {
    res.status(400).json({
      message: "Password is incorrect",
    });
    return;
  }
  const token = jwt.sign({ sub: userdetail._id.toString() }, secret, {
    expiresIn: "5h",
  });
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    message: "Login Successful",
  });
  return;
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const),
  });

  res.status(200).json({
    message: "Logout successful",
  });
});

export const codeExecutor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const response = await axios.post(
    "https://api.onlinecompiler.io/api/run-code-sync/",
    {
      compiler: languageMap[req.body.language],
      code: req.body.code,
      input: req.body.input,
    },
    {
      headers: {
        Authorization: process.env.ONLINE_COMPILER_API_KEY,
      },
    }
  );

  res.json(response.data);
});
