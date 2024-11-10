"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Dashboard() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">
          Welcome, {user?.name || "Guest"}
        </h1>
      </div>
    </div>
  );
}
