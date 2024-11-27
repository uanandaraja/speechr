import { useQuery } from "@tanstack/react-query";

interface PresignedUrlResponse {
  url: string;
}

export const useGetPresignedUrl = (fileKey: string) => {
  return useQuery({
    queryKey: ["presignedUrl", fileKey],
    queryFn: async () => {
      const res = await fetch(
        `/api/v1/tts/presigned/${encodeURIComponent(fileKey)}`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to get presigned URL");
      return res.json() as Promise<PresignedUrlResponse>;
    },
    staleTime: 1000 * 60 * 50, // 50 minutes
  });
};
