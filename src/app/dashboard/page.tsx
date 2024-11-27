"use client";

import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGetGeneratedAudio } from "@/hooks/tts/useGetAllGeneratedAudio";
import { useGetPresignedUrl } from "@/hooks/tts/useGetPresignedUrl";
import { GeneratedAudio } from "@/types";

interface AudioItemProps {
  audio: GeneratedAudio;
}

export default function Dashboard() {
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  const { data: generatedAudio, isLoading: isAudioLoading } =
    useGetGeneratedAudio();

  if (isUserLoading || isAudioLoading) return <div>Loading ...</div>;
  if (userError)
    return <div className="text-red-500">Error: {userError.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8 pb-12 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gray-900 p-6 rounded-lg flex items-center justify-between space-x-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Welcome!</h2>
            <p className="text-sm text-gray-300 font-[family-name:var(--font-geist-mono)]">
              {user?.name || "Unknown"}
            </p>
          </div>
          {user?.profileImageUrl && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={user.profileImageUrl}
                alt={`${user.name}'s profile`}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Generated Audio</h3>
          {generatedAudio?.map((audio) => (
            <AudioItem key={audio.id} audio={audio} />
          ))}
        </div>
      </main>
    </div>
  );
}

function AudioItem({ audio }: AudioItemProps) {
  const { data: presignedUrl } = useGetPresignedUrl(audio.fileKey ?? "");

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <p>
        {audio.generatedAudioText.length > 50
          ? audio.generatedAudioText.slice(0, 50) + "..."
          : audio.generatedAudioText}
      </p>
      <p className="text-sm text-gray-400">Status: {audio.status}</p>
      {audio.status === "completed" && presignedUrl?.url && (
        <audio controls src={presignedUrl.url} className="mt-2 w-full" />
      )}
    </div>
  );
}
