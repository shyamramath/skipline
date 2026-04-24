"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { APP_CONFIG } from "./config/app.config";
import { useAuth } from "./context/AuthContext";
import { Property } from "./types/property";
import { apiFetch } from "./lib/apiFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [homes, setHomes] = useState<Property[]>([]);
  const [loadingHomes, setLoadingHomes] = useState(false);

  useEffect(() => {
    async function fetchHomes() {
      if (!isAuthenticated) return;

      setLoadingHomes(true);
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/home/myhomes`);
        if (response.ok) {
          const data = await response.json();
          setHomes(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch homes:", err);
      } finally {
        setLoadingHomes(false);
      }
    }

    if (!isLoading && isAuthenticated) {
      fetchHomes();
    }
  }, [isAuthenticated, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      </div>
    );
  }

  // Show dashboard for authenticated users
  if (isAuthenticated) {
    return <Dashboard user={user} homes={homes} loadingHomes={loadingHomes} />;
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
}

function Dashboard({
  user,
  homes,
  loadingHomes,
}: {
  user: { email?: string; name?: string; firstName?: string; lastName?: string; picture?: string } | null;
  homes: Property[];
  loadingHomes: boolean;
}) {
  const displayName = user?.firstName || user?.name?.split(" ")[0] || "there";

  if (loadingHomes) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
              <span className="text-zinc-600 dark:text-zinc-400">Loading your dashboard...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No homes - show onboarding message
  if (homes.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <main className="mx-auto max-w-6xl px-6 py-12">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Welcome, {displayName}!
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Let&apos;s get your home set up with {APP_CONFIG.name}
            </p>
          </div>

          {/* Onboarding Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-12">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg
                  className="h-10 w-10 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>

              {/* Message */}
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                You need to onboard your home
              </h2>
              <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
                Register your home to get started with our home management services.
                Search for your address and add your property to begin.
              </p>

              {/* CTA Button */}
              <Link
                href="/search"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Register Your Home
              </Link>
            </div>

            {/* Steps */}
            <div className="mt-12 grid gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-700 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  1
                </div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Search Address</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Find your property by searching your address
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  2
                </div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Add to Inventory</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Save your property to your account
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  3
                </div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Schedule Service</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Book inspections and repairs
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Has homes - show dashboard
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Welcome Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Welcome back, {displayName}!
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Here&apos;s an overview of your properties
            </p>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{homes.length}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {homes.length === 1 ? "Property" : "Properties"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Active</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Account Status</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <Link href="/schedule-inspection" className="text-2xl font-bold text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400">
                  Schedule
                </Link>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Inspection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Your Properties</h2>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {homes.map((property, index) => (
              <Link
                key={`${property.id}-${index}`}
                href={`/property?assessorId=${encodeURIComponent(property.assessorID || "")}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <svg className="h-5 w-5 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {property.addressLine1 || property.formattedAddress}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {property.city}, {property.state} {property.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {property.propertyType && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {property.propertyType}
                    </span>
                  )}
                  <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <Link
              href="/inventory"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all properties →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/schedule-inspection"
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Schedule Inspection</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Book a home inspection visit</p>
            </div>
          </Link>

          <Link
            href="/schedule-inspection/view"
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
              <svg className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Reports</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">View inspection reports</p>
            </div>
          </Link>

          <Link
            href="/alerts"
            className="relative flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-6 transition-all hover:border-red-300 hover:shadow-md dark:border-red-800 dark:bg-red-900/20 dark:hover:border-red-700"
          >
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-300">Immediate Attention</h3>
              <p className="text-sm text-red-600 dark:text-red-400">Urgent service alerts</p>
            </div>
          </Link>

          <Link
            href="/subscription"
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">View Plans</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Explore subscription options</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Content */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
                Your Home, <br />
                <span className="text-blue-600 dark:text-blue-400">Our Priority</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Register your home with {APP_CONFIG.name} and let our expert handymen take care of all your repair needs. From minor fixes to major renovations, we&apos;ve got you covered.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                <a
                  href="#how-it-works"
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-white transition-colors hover:bg-blue-700"
                >
                  Get Started
                </a>
                <Link
                  href="/about"
                  className="flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Handyman Image */}
            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 shadow-xl dark:from-blue-900/20 dark:to-zinc-800">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH}/handyman.jpg`}
                  alt="Professional handyman at work"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-white p-4 shadow-lg dark:bg-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">500+</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Homes Serviced</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              How It Works
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Getting your home repaired has never been easier
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Register Your Home
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Search for your address and add your property to our system. It only takes a minute.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Schedule a Visit
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Our expert team will visit your home to assess and identify all repair needs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Get It Fixed
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Sit back and relax while our skilled handymen handle all the repairs professionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              See It In Action
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Watch how {APP_CONFIG.name} makes home management effortless
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-xl dark:border-zinc-800">
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/P7e7GMhLup0?rel=0&modestbranding=1"
                title="ANeighbor Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Our Services
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Comprehensive home repair and maintenance solutions
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🔧", title: "Plumbing", desc: "Leaks, clogs, installations" },
              { icon: "⚡", title: "Electrical", desc: "Wiring, outlets, fixtures" },
              { icon: "🎨", title: "Painting", desc: "Interior & exterior" },
              { icon: "🪚", title: "Carpentry", desc: "Repairs & installations" },
              { icon: "❄️", title: "HVAC", desc: "Heating & cooling" },
              { icon: "🚪", title: "Doors & Windows", desc: "Repairs & replacements" },
              { icon: "🏠", title: "Roofing", desc: "Repairs & maintenance" },
              { icon: "🧹", title: "General Repairs", desc: "All handyman work" },
            ].map((service, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-3xl">{service.icon}</span>
                <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-200 bg-blue-600 py-16 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Register your home today and let us take care of all your repair needs.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            Get Started Now
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
