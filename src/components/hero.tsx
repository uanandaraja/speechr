"use client";

import { Button } from "./ui/button";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export function Hero() {
  const { refetch: startGoogleAuth, isFetching } = useGoogleAuth();

  const handleLogin = () => {
    startGoogleAuth();
  };
  return (
    <div className="px-4 py-20 md:py-32 mx-auto text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Know more things by listening
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
        Turn boring texts into lively audio. Narrate your books, essays, or PDFs
        with your favorite characters.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button
          variant="default"
          size="lg"
          onClick={handleLogin}
          disabled={isFetching}
        >
          {isFetching ? "Redirecting..." : "Try Now"}
        </Button>
        <Button variant="outline" size="lg">
          View Demo
        </Button>
      </div>
    </div>
  );
}
