"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/apiFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function PhoneSetupModal() {
  const { user, isAuthenticated, isLoading, refreshSession } = useAuth();
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show only when authenticated and phone number is missing
  if (isLoading || !isAuthenticated || !user || user.phoneNumber) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed) {
      setError("Please enter a valid phone number.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await apiFetch(`${API_BASE_URL}/api/user/phone`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: trimmed }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to save phone number.");
      }

      await refreshSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
          <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </div>

        <h2 className="mb-1 text-center text-xl font-bold text-zinc-900 dark:text-zinc-100">
          One last step
        </h2>
        <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Please add your phone number to continue. This is required for scheduling inspections and managing properties.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              autoFocus
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !phone.trim()}
            className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-zinc-900 dark:border-t-transparent" />
                Saving...
              </span>
            ) : (
              "Save & Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
