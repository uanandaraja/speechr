import { useQuery } from "@tanstack/react-query";

interface GoogleAuthResponse {
  status: string;
  url: string;
}

export const useGoogleAuth = () => {
  return useQuery({
    queryKey: ["googleAuth"],
    queryFn: async () => {
      const res = await fetch("/api/v1/auth/google");
      const data = (await res.json()) as GoogleAuthResponse;
      if (!data.url) throw new Error("No URL returned");
      window.location.href = data.url;
      return data;
    },
    enabled: false,
  });
};
