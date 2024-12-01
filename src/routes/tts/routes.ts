import { Hono } from "hono";
import { authenticateUser } from "@/middleware/auth";
import {
  createAudioGeneration,
  getGenerationStatus,
  handleCallback,
  getGeneratedAudio,
  getAllVoices,
  getAllGeneratedAudio,
} from "./handlers";

const ttsRouter = new Hono();

ttsRouter.post("/", authenticateUser, createAudioGeneration);
ttsRouter.get("/voices", authenticateUser, getAllVoices);
ttsRouter.get("/status/:id", authenticateUser, getGenerationStatus);
ttsRouter.get("/:id", authenticateUser, getGeneratedAudio);
ttsRouter.get("/", authenticateUser, getAllGeneratedAudio);
ttsRouter.post("/callback", handleCallback);

export default ttsRouter;
