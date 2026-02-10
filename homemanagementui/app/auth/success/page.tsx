"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface SessionUser {
  email: string;
  name: string;
  picture?: string;
}

function AuthSuccessContent() {
  const { refreshSession } = useAuth();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Verify the session with the backend
        const response = await fetch(`${API_BASE_URL}/api/session`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        console.log("Session response status:", response.status);
        const responseText = await response.text();
        console.log("Session response:", responseText);

        if (response.ok && responseText) {
          const sessionData = JSON.parse(responseText);
          console.log("Parsed session data:", sessionData);

          // Handle various response structures from backend
          const userData = sessionData.user || sessionData.principal || sessionData;

          // Check for different field names the backend might use
          const email = userData.email || userData.mail || userData.username || "";
          const name = userData.name || userData.displayName || userData.fullName ||
                       userData.firstName || email.split("@")[0] || "User";
          const picture = userData.picture || userData.imageUrl || userData.avatar ||
                          userData.profilePicture || userData.photo || "";

          if (email || userData.id || userData.sub) {
            setUser({ email, name, picture });

            // Refresh the auth context
            await refreshSession();

            // Redirect to home after showing success message
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          } else {
            console.error("Session data structure:", JSON.stringify(sessionData, null, 2));
            setError(`Session data is incomplete. Response: ${JSON.stringify(sessionData).substring(0, 100)}`);
          }
        } else {
          console.error("Session verification failed:", response.status, responseText);
          setError(`Failed to verify session (${response.status}). Please try logging in again.`);
        }
      } catch (err) {
        console.error("Session verification error:", err);
        setError("An error occurred while verifying your session.");
      } finally {
        setChecking(false);
      }
    };

    verifySession();
  }, [refreshSession]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
          <span className="text-zinc-600 dark:text-zinc-400">
            Verifying your session...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md px-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Authentication Error
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {error}
            </p>
            <a
              href="/login"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {user?.picture && (
            <img
              src={user.picture}
              alt="Profile"
              className="mx-auto mb-4 h-16 w-16 rounded-full"
              referrerPolicy="no-referrer"
            />
          )}

          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Login Successful!
          </h1>
          <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Welcome, {user?.name}!
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {user?.email}
          </p>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
            Redirecting to home...
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
