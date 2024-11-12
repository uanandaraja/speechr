"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRelativeTime } from "@/lib/dateUtils";

interface Tracking {
  id: string;
  date: Date;
  completed: boolean;
}

interface HabitCardProps {
  id: string;
  name: string;
  createdAt: Date;
  tracking: Tracking[];
  isToggling: boolean;
  onToggle: (id: string) => void;
}

export function HabitCard({
  id,
  name,
  createdAt,
  tracking,
  isToggling,
  onToggle,
}: HabitCardProps) {
  const completed = tracking.some(
    (t) => new Date(t.date).toDateString() === new Date().toDateString(),
  );

  const getDates = () => {
    const dates = [];
    const creationDate = new Date(createdAt);
    const daysToShow = 365; // Show one year by default

    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(creationDate);
      date.setDate(creationDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const getStreak = () => {
    const sortedTracking = [...tracking].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    let streak = 0;
    const today = new Date().toDateString();

    // Check if completed today or not
    const lastCompletedDate = sortedTracking[0]
      ? new Date(sortedTracking[0].date).toDateString()
      : null;

    if (lastCompletedDate === today) {
      streak = 1;

      // Count previous consecutive days
      for (let i = 1; i < sortedTracking.length; i++) {
        const currentDate = new Date(sortedTracking[i].date);
        const prevDate = new Date(sortedTracking[i - 1].date);

        const timeDiff = Math.abs(prevDate.getTime() - currentDate.getTime());
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) streak++;
        else break;
      }
    }

    return streak;
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{name}</h3>

        <Button
          variant={completed ? "default" : "outline"}
          onClick={() => onToggle(id)}
          disabled={isToggling || completed}
        >
          {isToggling ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : completed ? (
            <span className="flex items-center">💪</span>
          ) : (
            "✅"
          )}
        </Button>
      </div>

      <div className="text-sm text-gray-500 mt-1 flex gap-2">
        <div>Started {getRelativeTime(createdAt)}</div>
        <p>|</p>
        {getStreak() > 0
          ? `${getStreak()} days streak 🔥`
          : "Start your streak today!"}
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        {getDates().map((date, i) => {
          const isCompleted = tracking.some(
            (t) => new Date(t.date).toDateString() === date.toDateString(),
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
}
