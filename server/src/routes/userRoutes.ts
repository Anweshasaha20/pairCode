import { Router } from "express";
import { register, login, logout } from "../controller/userController";
import { auth } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
