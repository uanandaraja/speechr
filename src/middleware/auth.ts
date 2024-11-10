import { Context, Next } from "hono";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getCookie } from "hono/cookie";

export async function authenticateUser(c: Context, next: Next) {
  const { env } = getRequestContext();
  const sessionId = getCookie(c, "session");

  if (!sessionId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const session = await env.HABITKU_AUTH_KV.get(`session:${sessionId}`);
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const sessionData = JSON.parse(session);
  c.set("userId", sessionData.userId);

  await next();
}
