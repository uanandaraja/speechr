import { Hono } from "hono";
import { authenticateUser } from "@/middleware/auth";
import { getCurrentUser } from "./handlers";

const userRouter = new Hono();
userRouter.get("/me", authenticateUser, getCurrentUser);

export default userRouter;
