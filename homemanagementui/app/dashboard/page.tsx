"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/apiFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Inspection {
  id: number;
  assessorId: string;
  propertyAddress: string;
  inspectionTypes: string;
  scheduledDate: string;
  timeSlot: string;
  notes: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  "IN-PROGRESS": "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  COMPLETED: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
};

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Scheduled",
  "IN-PROGRESS": "In Progress",
  COMPLETED: "Completed",
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [inspectionsLoading, setInspectionsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiFetch(`${API_BASE_URL}/api/inspection/my`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setInspections(Array.isArray(data) ? data : []))
      .catch(() => setInspections([]))
      .finally(() => setInspectionsLoading(false));
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const displayName = user.firstName || user.name?.split(" ")[0] || "there";
  const initials =
    user.firstName && user.lastName
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
      : user.name?.charAt(0) || "U";

  const stats = [
    {
      label: "Scheduled",
      value: inspections.filter((i) => i.status === "SCHEDULED").length,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: "In Progress",
      value: inspections.filter((i) => i.status === "IN-PROGRESS").length,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: inspections.filter((i) => i.status === "COMPLETED").length,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Total Inspections",
      value: inspections.length,
      color: "text-zinc-600 dark:text-zinc-400",
      bg: "bg-zinc-100 dark:bg-zinc-800",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      href: "/schedule-inspection/create",
      label: "Schedule Inspection",
      description: "Book a new home inspection",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      color: "text-blue-600 dark:text-blue-400",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    {
      href: "/inventory",
      label: "My Properties",
      description: "View your saved homes",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      color: "text-purple-600 dark:text-purple-400",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      href: "/search",
      label: "Search Homes",
      description: "Find properties nearby",
      bg: "bg-green-50 dark:bg-green-900/20",
      color: "text-green-600 dark:text-green-400",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
    },
    {
      href: "/subscription",
      label: "Manage Plan",
      description: "View or upgrade your plan",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      color: "text-orange-600 dark:text-orange-400",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* Welcome Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className="h-14 w-14 rounded-full border-2 border-white shadow dark:border-zinc-800"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow">
                <span className="text-xl font-bold text-white">{initials.toUpperCase()}</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Welcome back, {displayName}!
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Settings
            </Link>
            <button
              onClick={logout}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-zinc-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className={`mb-3 inline-flex rounded-lg p-2 ${stat.bg}`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Recent Inspections */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Recent Inspections
                </h2>
                <Link
                  href="/schedule-inspection/create"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Schedule new
                </Link>
              </div>

              {inspectionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-300" />
                </div>
              ) : inspections.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
                  </svg>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No inspections scheduled yet.</p>
                  <Link
                    href="/schedule-inspection/create"
                    className="mt-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Schedule your first inspection
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {inspections.slice(0, 5).map((inspection) => {
                    const types = inspection.inspectionTypes
                      ? inspection.inspectionTypes.split(",").map((t) => t.trim()).filter(Boolean)
                      : [];
                    const statusStyle = STATUS_STYLES[inspection.status] || STATUS_STYLES["SCHEDULED"];
                    const statusLabel = STATUS_LABELS[inspection.status] || inspection.status;
                    return (
                      <div key={inspection.id} className="flex items-start justify-between gap-3 px-5 py-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {inspection.propertyAddress}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {types.map((t) => (
                              <span
                                key={t}
                                className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs capitalize text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                            {formatDate(inspection.scheduledDate)} · {inspection.timeSlot}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}>
                          {statusLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Quick Actions</h2>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.bg}`}>
                      <span className={action.color}>{action.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {action.label}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
