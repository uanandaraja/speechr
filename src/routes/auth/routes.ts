import { Hono } from "hono";
import {
  handleGoogleCallback,
  handleGoogleLogin,
  handleLogout,
} from "./handlers";

const authRouter = new Hono();

authRouter.get("/google", handleGoogleLogin);
authRouter.get("/google/callback", handleGoogleCallback);
authRouter.post("/logout", handleLogout);

export default authRouter;
