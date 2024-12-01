import { useQuery } from "@tanstack/react-query";
import { Voice } from "@/types";

export const useGetAllVoices = () => {
  return useQuery({
    queryKey: ["voices"],
    queryFn: async () => {
      const res = await fetch("/api/v1/tts/voices", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch voices");
      }
      return res.json() as Promise<Voice[]>;
    },
    staleTime: 1000 * 60, // 1 minute
  });
};
