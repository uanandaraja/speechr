export interface GeneratedAudio {
  id: string;
  userId: string;
  voiceId: string;
  generatedAudioText: string;
  generatedAudioUrl?: string;
  status: "processing" | "completed" | "failed";
  createdAt: Date;
  fileKey?: string;
  numOfCharacters: number;
  voice?: {
    id: string;
    name: string;
    voiceAudioUrl: string;
    voiceReferenceText: string;
  };
}
