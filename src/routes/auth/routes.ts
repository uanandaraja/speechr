import { Hono } from "hono";
import { handleGoogleCallback, handleGoogleLogin } from "./handlers";

const authRouter = new Hono();

authRouter.get("/google", handleGoogleLogin);
authRouter.get("/google/callback", handleGoogleCallback);

export default authRouter;
