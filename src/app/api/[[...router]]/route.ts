import { Hono } from "hono";
import { handle } from "hono/vercel";
import authRouter from "@/routes/auth/routes";

export const runtime = "edge";

const app = new Hono<{}>().basePath("/api/v1");

app.get("/ping", (c) => c.json({ message: "pong" }));
app.route("/auth", authRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
