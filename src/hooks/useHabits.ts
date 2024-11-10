import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  tracking: Array<{
    id: string;
    date: Date;
    completed: boolean;
  }>;
}

export const useHabits = () => {
  return useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const res = await fetch("/api/v1/habits");
      if (!res.ok) throw new Error("Failed to fetch habits");
      return res.json() as Promise<Habit[]>;
    },
  });
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await fetch("/api/v1/habits", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create habit");
      return res.json() as Promise<Habit>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};

export const useToggleHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: string) => {
      const res = await fetch(`/api/v1/habits/${habitId}/toggle`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to toggle habit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};
