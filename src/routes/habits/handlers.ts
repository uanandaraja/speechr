import { Context } from "hono";
import { getDbClient } from "@/db";
import { habitTable, trackingTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createHabit(c: Context) {
  const userId = c.get("userId");
  const { name, description } = await c.req.json();
  const db = getDbClient();

  const habit = await db
    .insert(habitTable)
    .values({
      id: nanoid(),
      userId,
      name,
      description,
      createdAt: new Date(),
    })
    .returning()
    .get();

  return c.json(habit);
}

export async function getHabits(c: Context) {
  const userId = c.get("userId");
  const db = getDbClient();

  const habits = await db.query.habitTable.findMany({
    where: eq(habitTable.userId, userId),
    with: {
      tracking: true,
    },
  });

  return c.json(habits);
}

export async function toggleHabit(c: Context) {
  const habitId = c.req.param("habitId");
  const today = new Date();
  const db = getDbClient();

  const existing = await db.query.trackingTable.findFirst({
    where: and(
      eq(trackingTable.habitId, habitId),
      eq(trackingTable.date, today),
    ),
  });

  if (existing) {
    await db.delete(trackingTable).where(eq(trackingTable.id, existing.id));
  } else {
    await db.insert(trackingTable).values({
      id: nanoid(),
      habitId,
      date: today,
      completed: true,
    });
  }

  return c.json({ success: true });
}
