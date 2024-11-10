import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  googleId: string;
  email: string;
  emailVerified: boolean;
  name: string;
  givenName?: string;
  familyName?: string;
  profileImageUrl?: string;
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("/api/v1/users/me", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return res.json() as Promise<User>;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
