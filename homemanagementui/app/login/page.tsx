"use client";

import { useState } from "react";
import Image from "next/image";
import { APP_CONFIG } from "../config/app.config";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoading && isAuthenticated) {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/dashboard`;
    return null;
  }

  function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    login();
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">

      {/* Left panel — branding & features */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-400 via-blue-300 to-blue-500 px-12 py-14 lg:flex lg:w-1/2">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/Aneighbour.jpeg`}
              alt={APP_CONFIG.name}
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="text-xl font-bold text-white">{APP_CONFIG.name}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-tight text-white">
              Your home,<br />managed smarter.
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Schedule inspections, track your property, and stay on top of maintenance — all in one place.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-4">
            {[
              { icon: "🏠", text: "Register and manage multiple properties" },
              { icon: "🔍", text: "Schedule professional home inspections" },
              { icon: "📋", text: "Track maintenance history in real time" },
              { icon: "🔒", text: "Your data is encrypted and secure" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm">
                  {item.icon}
                </span>
                <span className="text-blue-50">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="relative rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
          <p className="text-sm italic text-blue-100">
            &quot;ANeighbour made it incredibly easy to keep track of my home&apos;s maintenance needs. I finally feel in control.&quot;
          </p>
          <p className="mt-3 text-sm font-semibold text-white">— A happy homeowner in Austin, TX</p>
        </div>
      </div>

      {/* Right panel — sign in form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/Aneighbour.jpeg`}
              alt={APP_CONFIG.name}
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{APP_CONFIG.name}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Welcome back
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Sign in to your {APP_CONFIG.name} account to continue
          </p>

          {/* Security notice */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-900/20">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your information is handled with <strong>end-to-end encryption</strong>. We never share your data with third parties.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white py-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
          >
            {googleLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* What you get after login */}
          <div className="mt-8 rounded-xl border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              After signing in you can
            </p>
            <ul className="space-y-2.5">
              {[
                "Register your home and view property details",
                "Schedule and track home inspections",
                "Get notified about maintenance needs",
                "Manage everything from your dashboard",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <svg className="h-4 w-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
