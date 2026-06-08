import { Router } from "express";
import { register, login, logout , codeExecutor } from "../controller/userController";
import { auth } from "../middleware/auth";
import { createRoom  , joinRoom} from "../controller/roomController";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/rooms", auth, createRoom);
router.post("/join-room" , auth , joinRoom);

router.post("/run", auth, codeExecutor);

export default router;
