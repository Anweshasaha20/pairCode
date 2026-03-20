import { Router } from "express";
import { register, login, logout } from "../controller/userController";
import { auth } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes (require authentication)
router.get("/dashboard", auth, (req: any, res) => {
  res.status(200).json({
    message: "User dashboard",
    user: req.user,
  });
});

export default router;
