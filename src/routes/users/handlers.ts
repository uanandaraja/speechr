import { Context } from "hono";
import { getDbClient } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser(c: Context) {
  const userId = c.get("userId");
  const db = getDbClient();

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, userId),
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
}
