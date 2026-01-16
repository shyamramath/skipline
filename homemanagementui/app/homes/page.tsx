"use client";

import { useEffect, useState } from "react";
import { Home } from "../types/home";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function HomesPage() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHomes() {
      try {
        const response = await fetch(`${API_BASE_URL}/home/details`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data);
        // Handle both single object and array response
        setHomes(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch home details");
      } finally {
        setLoading(false);
      }
    }

    fetchHomes();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-semibold text-black dark:text-zinc-50">
          Home Details
        </h1>

        {homes.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No homes found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {homes.map((home, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-medium text-black dark:text-zinc-50">
                    {home.address}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {home.city}, {home.state} {home.zipCode}
                  </p>
                </div>
                {home.sizeInSqFt != null && (
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
                    <span className="font-medium">Size:</span>
                    <span>{home.sizeInSqFt.toLocaleString()} sq ft</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
