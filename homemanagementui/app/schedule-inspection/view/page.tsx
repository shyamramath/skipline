"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/apiFetch";

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

const STATUS_STYLES: Record<string, { label: string; classes: string }> = {
  SCHEDULED: {
    label: "Scheduled",
    classes: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  },
  "IN-PROGRESS": {
    label: "In Progress",
    classes: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  },
  COMPLETED: {
    label: "Completed",
    classes: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ViewInspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/api/inspection/my`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((data) => setInspections(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Scheduled Inspections
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              View and manage your upcoming inspections.
            </p>
          </div>
          <Link
            href="/schedule-inspection/create"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            New Inspection
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && inspections.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <svg className="h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
            </svg>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No inspections scheduled yet.</p>
            <Link
              href="/schedule-inspection/create"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Schedule your first inspection
            </Link>
          </div>
        )}

        {/* Inspection List */}
        {!loading && !error && inspections.length > 0 && (
          <div className="flex flex-col gap-4">
            {inspections.map((inspection) => {
              const types = inspection.inspectionTypes
                ? inspection.inspectionTypes.split(",").map((t) => t.trim()).filter(Boolean)
                : [];
              const status = STATUS_STYLES[inspection.status] ?? {
                label: inspection.status,
                classes: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
              };
              return (
                <div
                  key={inspection.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  {/* Address + status */}
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {inspection.propertyAddress}
                    </h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.classes}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="mb-3 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {formatDate(inspection.scheduledDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {inspection.timeSlot}
                    </span>
                  </div>

                  {/* Type badges */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {types.map((type) => (
                      <span
                        key={type}
                        className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium capitalize text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Notes */}
                  {inspection.notes && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{inspection.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/schedule-inspection"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Back to Schedule Inspection
          </Link>
        </div>
      </div>
    </div>
  );
}
