import { Hono } from "hono";
import { handle } from "hono/vercel";
import authRouter from "@/routes/auth/routes";
import userRouter from "@/routes/users/routes";
import habitRouter from "@/routes/habits/routes";

export const runtime = "edge";

const app = new Hono<{}>().basePath("/api/v1");

app.get("/ping", (c) => c.json({ message: "pong" }));
app.route("/auth", authRouter);
app.route("/users", userRouter);
app.route("/habits", habitRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
