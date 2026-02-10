"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.name || "User";

  const initials = user.firstName && user.lastName
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : user.name?.charAt(0) || "U";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Profile
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center border-b border-zinc-200 pb-8 dark:border-zinc-800 sm:flex-row sm:items-start sm:gap-8">
            {/* Profile Image */}
            <div className="relative">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="h-32 w-32 rounded-full border-4 border-white shadow-lg dark:border-zinc-800"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg dark:border-zinc-800">
                  <span className="text-4xl font-bold text-white">
                    {initials.toUpperCase()}
                  </span>
                </div>
              )}
              {/* Online indicator */}
              <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-white bg-green-500 dark:border-zinc-900" />
            </div>

            {/* Name and Email */}
            <div className="mt-6 text-center sm:mt-0 sm:text-left">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {displayName}
              </h2>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                {user.email}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  </svg>
                  Google Account
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Account Details
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  First Name
                </label>
                <p className="mt-1 text-lg text-zinc-900 dark:text-zinc-100">
                  {user.firstName || "-"}
                </p>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Last Name
                </label>
                <p className="mt-1 text-lg text-zinc-900 dark:text-zinc-100">
                  {user.lastName || "-"}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Email Address
                </label>
                <p className="mt-1 text-lg text-zinc-900 dark:text-zinc-100">
                  {user.email || "-"}
                </p>
              </div>

              {/* User ID */}
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  User ID
                </label>
                <p className="mt-1 text-lg text-zinc-900 dark:text-zinc-100">
                  {user.id || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Quick Links
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/inventory"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">My Properties</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">View saved properties</p>
                </div>
              </Link>

              <Link
                href="/schedule-inspection"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">Inspections</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Schedule or view inspections</p>
                </div>
              </Link>

              <Link
                href="/subscription"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">Subscription</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your plan</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
