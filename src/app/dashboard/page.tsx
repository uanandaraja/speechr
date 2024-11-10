"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHabits, useCreateHabit, useToggleHabit } from "@/hooks/useHabits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Tracking {
  id: string;
  date: Date;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  tracking: Tracking[];
}

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

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toDateString();
    return habit.tracking.some(
      (t) => new Date(t.date).toDateString() === today,
    );
  };

  return (
    <div className="container mx-auto p-4">
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
        {habits?.map((habit) => {
          const completed = isCompletedToday(habit);

          return (
            <Card key={habit.id} className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{habit.name}</h3>

                <Button
                  variant={completed ? "default" : "outline"}
                  onClick={() => toggleHabit(habit.id)}
                  disabled={isToggling || completed} // Disable if already completed
                >
                  {isToggling ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </span>
                  ) : completed ? (
                    <span className="flex items-center">
                      <Check className="mr-2 h-4 w-4" />
                      Completed
                    </span>
                  ) : (
                    "Mark Complete"
                  )}
                </Button>
              </div>

              <div className="text-sm text-gray-500 mt-1">
                Started {new Date(habit.createdAt).toLocaleDateString()}
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {[...Array(365)].map((_, i) => {
                  const date = new Date();
                  const startDate = new Date(habit.createdAt);
                  date.setDate(startDate.getDate() + i);

                  const isCompleted = habit.tracking.some(
                    (t) =>
                      new Date(t.date).toDateString() === date.toDateString(),
                  );

                  return (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className={`w-3 h-3 rounded ${
                              isCompleted ? "bg-green-500" : "bg-gray-200"
                            } hover:scale-150 transition-transform`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{date.toLocaleDateString()}</p>
                          <p>{isCompleted ? "Completed" : "Not completed"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
