import {githubCallback , githubRedirect, validateAuth} from "../controller/authController";
import {Router} from "express";
import { auth } from "../middleware/auth";
const authRouter = Router();

authRouter.get("/github", githubRedirect);
authRouter.get("/github/callback", githubCallback);
authRouter.get("/validate", auth, validateAuth);

export default authRouter;