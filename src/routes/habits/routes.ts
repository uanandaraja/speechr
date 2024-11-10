import { Hono } from "hono";
import { authenticateUser } from "@/middleware/auth";
import { createHabit, getHabits, toggleHabit } from "./handlers";

const habitRouter = new Hono();

habitRouter.use("*", authenticateUser);
habitRouter.post("/", createHabit);
habitRouter.get("/", getHabits);
habitRouter.post("/:habitId/toggle", toggleHabit);

export default habitRouter;
