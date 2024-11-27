import { useQuery } from "@tanstack/react-query";
import { GeneratedAudio } from "@/types";

export const useGetGeneratedAudio = () => {
  return useQuery({
    queryKey: ["generatedAudio"],
    queryFn: async () => {
      const res = await fetch("/api/v1/tts", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch generated audio");
      }
      return res.json() as Promise<GeneratedAudio[]>;
    },
    staleTime: 1000 * 60, // 1 minute
  });
};
