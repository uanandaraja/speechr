import { Hono } from "hono";
import { handle } from "hono/vercel";
// import productsRouter from "../../../routes/products";

// type Bindings = {
//   FILE_STORAGE: R2Bucket;
//   R2_PUBLIC_URL: string;
// };

export const runtime = "edge";

const app = new Hono<{}>().basePath("/api/v1");

app.get("/ping", (c) => c.json({ message: "pong" }));
// app.route("/products", productsRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
