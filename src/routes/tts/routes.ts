import { Hono } from "hono";
import { authenticateUser } from "@/middleware/auth";
import {
  createAudioGeneration,
  getGenerationStatus,
  handleCallback,
  getGeneratedAudio,
  getAllGeneratedAudio,
  getPresignedUrl,
} from "./handlers";

const ttsRouter = new Hono();

ttsRouter.post("/", authenticateUser, createAudioGeneration);
ttsRouter.get("/status/:id", authenticateUser, getGenerationStatus);
ttsRouter.get("/:id", authenticateUser, getGeneratedAudio);
ttsRouter.get("/", authenticateUser, getAllGeneratedAudio);
ttsRouter.post("/callback", handleCallback);
ttsRouter.get("/presigned/:key", authenticateUser, getPresignedUrl);

export default ttsRouter;
