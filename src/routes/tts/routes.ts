import { Hono } from "hono";
import { authenticateUser } from "@/middleware/auth";
import {
  createAudioGeneration,
  getGenerationStatus,
  handleCallback,
  getGeneratedAudio,
} from "./handlers";

const ttsRouter = new Hono();

ttsRouter.post("/", authenticateUser, createAudioGeneration);
ttsRouter.get("/status/:id", authenticateUser, getGenerationStatus);
ttsRouter.get("/:id", authenticateUser, getGeneratedAudio);
ttsRouter.post("/callback", authenticateUser, handleCallback);

export default ttsRouter;
