"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-md px-6 text-center">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Payment Successful!
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Thank you for subscribing to HomeManager. Your subscription is now active.
          </p>

          {sessionId && (
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
              Session ID: {sessionId.slice(0, 20)}...
            </p>
          )}

          <div className="mt-8 space-y-3">
            <Link
              href="/inventory"
              className="block w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Go to Inventory
            </Link>
            <Link
              href="/"
              className="block w-full rounded-lg border border-zinc-300 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
