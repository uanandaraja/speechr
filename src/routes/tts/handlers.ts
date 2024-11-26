import { Context } from "hono";
import { getDbClient } from "@/db";
import { voiceTable, generatedAudioTable, queueTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const TTS_PROVIDER_URL = process.env.TTS_PROVIDER_URL;
const TTS_CALLBACK_URL = process.env.CALLBACK_URL;

export async function createAudioGeneration(c: Context) {
  const userId = c.get("userId");
  const { text_to_generate, voice_id } = await c.req.json();
  const db = getDbClient();

  const voice = await db.query.voiceTable.findFirst({
    where: eq(voiceTable.id, voice_id),
  });

  if (!voice) return c.json({ error: "Voice not found" }, 404);

  const generatedAudio = await db
    .insert(generatedAudioTable)
    .values({
      id: nanoid(),
      userId,
      generatedAudioText: text_to_generate,
      voiceId: voice_id,
      status: "processing",
      createdAt: new Date(),
      numOfCharacters: text_to_generate.length,
    })
    .returning()
    .get();

  if (!TTS_PROVIDER_URL) {
    throw new Error("TTS_PROVIDER_URL is not defined");
  }

  fetch(TTS_PROVIDER_URL, {
    method: "POST",
    body: JSON.stringify({
      audio_url: voice.voiceAudioUrl,
      reference_text: voice.voiceReferenceText,
      callback_url: `${TTS_CALLBACK_URL}`,
      text_to_generate: text_to_generate,
    }),
  }).catch(async (error) => {
    console.error(error);
    await db
      .update(generatedAudioTable)
      .set({ status: "failed" })
      .where(eq(generatedAudioTable.id, generatedAudio.id));
  });

  return c.json({ id: generatedAudio.id, status: "processing" });
}

export async function getGenerationStatus(c: Context) {
  const { id } = c.req.param();
  const db = getDbClient();

  const audio = await db.query.generatedAudioTable.findFirst({
    where: eq(generatedAudioTable.id, id),
  });

  if (!audio) return c.json({ error: "Generation not found" }, 404);
  return c.json(audio);
}

export async function getGeneratedAudio(c: Context) {
  const { id } = c.req.param();
  const userId = c.get("userId");
  const db = getDbClient();

  const audio = await db.query.generatedAudioTable.findFirst({
    where: eq(generatedAudioTable.id, id),
    with: {
      voice: true,
    },
  });

  if (!audio) return c.json({ error: "Audio not found" }, 404);
  if (audio.userId !== userId) return c.json({ error: "Unauthorized" }, 403);

  return c.json(audio);
}

export async function handleCallback(c: Context) {
  const { generated_audio_id, audio_url } = await c.req.json();
  const db = getDbClient();

  await db.transaction(async (tx) => {
    await tx
      .update(generatedAudioTable)
      .set({
        status: "complete",
        generatedAudioUrl: audio_url,
      })
      .where(eq(generatedAudioTable.id, generated_audio_id));

    await tx
      .update(queueTable)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(queueTable.generatedAudioId, generated_audio_id));
  });

  return c.json({ success: true });
}