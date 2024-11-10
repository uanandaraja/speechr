"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useHabits, useCreateHabit, useToggleHabit } from "@/hooks/useHabits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { mutate: createHabit } = useCreateHabit();
  const { mutate: toggleHabit } = useToggleHabit();
  const [newHabitName, setNewHabitName] = useState("");

  if (userLoading || habitsLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Welcome, {user?.name}</h1>

      <div className="flex gap-4 mb-8">
        <Input
          placeholder="New habit name..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <Button
          onClick={() => {
            createHabit({ name: newHabitName });
            setNewHabitName("");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits?.map((habit) => (
          <Card key={habit.id} className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{habit.name}</h3>
              <Button
                variant={
                  habit.tracking.some((t) => {
                    const today = new Date();
                    const trackingDate = new Date(t.date);
                    return trackingDate.toDateString() === today.toDateString();
                  })
                    ? "default"
                    : "outline"
                }
                onClick={() => toggleHabit(habit.id)}
              >
                Done!
              </Button>
            </div>

            <div className="mt-4 flex gap-1">
              {[...Array(7)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const completed = habit.tracking.some(
                  (t) =>
                    new Date(t.date).toDateString() === date.toDateString(),
                );

                return (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded ${
                      completed ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
