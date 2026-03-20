import jwt from "jsonwebtoken";
import user from "../models/User";
import type { Iuser } from "../models/User";
import { Request, Response, NextFunction } from "express";

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

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // const token = req.cookies.token; // this throws error if req.cookies is undefined
  try {
    const secret = getJwtSecret();
    const token = req.cookies?.token; // this checks if req.cookies is undefined or not if undeined it doesnt throw err
    //rather it returns undefined
    if (!token) {
      res.status(401).json({
        message: "Please register to proceed",
      });
      return;
    }
    // now token is present for sure
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    const userid = decoded.sub as string;
    const userdetail = await user.findById(userid);
    if (!userdetail) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    } else {
      req.user = userdetail;
      next();
      return;
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Error in verifying token";
    const statusCode = errorMessage.includes("PASS_KEY") ? 500 : 401;

    res.status(statusCode).json({
      message: errorMessage,
    });
    return;
  }
};
