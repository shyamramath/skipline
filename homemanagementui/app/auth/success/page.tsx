"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function AuthSuccessContent() {
  const { refreshSession } = useAuth();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  // Read user info passed as query params by the Spring Boot backend
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || email.split("@")[0] || "User";
  const picture = searchParams.get("picture") || "";

  useEffect(() => {
    if (!email) {
      setError("Authentication failed. No user information received.");
      return;
    }

    // Store user info in localStorage so AuthContext can read it after page navigation
    // (session cookies don't reliably work cross-origin between www and non-www)
    localStorage.setItem("auth_user", JSON.stringify({ email, name, picture }));

    // Refresh the auth context so the rest of the app knows the user is logged in
    refreshSession().then(() => {
      setTimeout(() => {
        window.location.href = `${BASE_PATH}/dashboard`;
      }, 1500);
    });
  }, [email, name, picture, refreshSession]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md px-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Authentication Error</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{error}</p>
            <a
              href={`${BASE_PATH}/login`}
              className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {picture && (
            <img
              src={picture}
              alt="Profile"
              className="mx-auto mb-4 h-16 w-16 rounded-full"
              referrerPolicy="no-referrer"
            />
          )}

          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Login Successful!</h1>
          <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Welcome, {name}!
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{email}</p>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
            <span className="text-zinc-600 dark:text-zinc-400">Loading...</span>
          </div>
        </div>
      }
    >
      <AuthSuccessContent />
    </Suspense>
  );
}
