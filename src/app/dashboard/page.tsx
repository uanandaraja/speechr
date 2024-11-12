"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHabits, useCreateHabit, useToggleHabit } from "@/hooks/useHabits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { HabitCard } from "@/components/HabitCard";

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { mutate: createHabit, isPending: isCreating } = useCreateHabit();
  const { mutate: toggleHabit, isPending: isToggling } = useToggleHabit();
  const [newHabitName, setNewHabitName] = useState("");

  if (userLoading || habitsLoading) return <div>Loading...</div>;

  const handleCreateHabit = () => {
    const name = newHabitName.trim();
    if (!name) {
      toast.error("Habit name cannot be empty");
      return;
    }

    if (habits?.some((h) => h.name.toLowerCase() === name.toLowerCase())) {
      toast.error("A habit with this name already exists");
      return;
    }

    createHabit(
      { name },
      {
        onSuccess: () => {
          setNewHabitName("");
          toast.success("Habit created!");
        },
        onError: () => toast.error("Failed to create habit"),
      },
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-16">
      <h1 className="text-2xl font-bold mb-8">Welcome, {user?.name}</h1>

      <div className="flex gap-4 mb-8">
        <Input
          placeholder="New habit name..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          disabled={isCreating}
        />
        <Button
          onClick={handleCreateHabit}
          disabled={isCreating || !newHabitName.trim()}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? "Adding..." : "Add Habit"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {habits?.map((habit) => (
          <HabitCard
            key={habit.id}
            {...habit}
            isToggling={isToggling}
            onToggle={toggleHabit}
          />
        ))}
      </div>
    </div>
  );
}
