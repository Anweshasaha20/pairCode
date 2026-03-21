import { Router } from "express";
import { register, login, logout } from "../controller/userController";
import { auth } from "../middleware/auth";
import { createRoom } from "../controller/roomController";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/rooms", auth, createRoom);

export default router;
