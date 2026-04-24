"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Property } from "../../types/property";
import { apiFetch } from "../../lib/apiFetch";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const INSPECTION_TYPES = [
  {
    id: "general",
    name: "General",
    description: "Full home walkthrough & condition assessment",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: "roof",
    name: "Roof",
    description: "Shingles, flashing, gutters & structural integrity",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 12h3v8h14v-8h3L12 3z" />
      </svg>
    ),
  },
  {
    id: "hvac",
    name: "HVAC",
    description: "Heating, ventilation & air conditioning systems",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-8-9h1m16 0h1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Pipes, drains, water heaters & fixtures",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m-5-9H5m14 0h-2M7.05 7.05l1.41 1.41m7.08 7.08l1.41 1.41M7.05 16.95l1.41-1.41m7.08-7.08l1.41-1.41M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Wiring, panels, outlets & safety compliance",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "pest-control",
    name: "Pest Control",
    description: "Termites, rodents & pest damage inspection",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152-6.135c-.22-2.578-2.022-4.611-4.442-5.274A2.86 2.86 0 0012 2.25a2.86 2.86 0 00-2.613.781c-2.42.663-4.222 2.696-4.442 5.274a23.906 23.906 0 01-1.152 6.135A24.29 24.29 0 0112 12.75z" />
      </svg>
    ),
  },
] as const;

const ALL_TYPE_IDS = INSPECTION_TYPES.map((t) => t.id);

const TIME_SLOTS = [
  "9:00 AM – 12:00 PM",
  "12:00 PM – 3:00 PM",
  "3:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
] as const;

function ScheduleInspectionContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const preselectedAssessorId = searchParams.get("assessorId");
  // Inventory state
  const [inventory, setInventory] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(() => new Set(ALL_TYPE_IDS));
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch inventory on mount
  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/home/myhomes`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        const properties: Property[] = Array.isArray(data) ? data : [];
        setInventory(properties);

        // Pre-select property if assessorId is in URL
        if (preselectedAssessorId) {
          const match = properties.find(
            (p) => p.assessorID === preselectedAssessorId
          );
          if (match) setSelectedProperty(match);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch inventory");
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, [preselectedAssessorId]);

  function toggleType(id: string) {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    if (selectedTypes.size === ALL_TYPE_IDS.length) {
      setSelectedTypes(new Set());
    } else {
      setSelectedTypes(new Set(ALL_TYPE_IDS));
    }
  }

  function handlePropertyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const assessorId = e.target.value;
    const match = inventory.find((p) => p.assessorID === assessorId) || null;
    setSelectedProperty(match);
  }

  async function handleSubmit() {
    if (!selectedProperty || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/inspection/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessorId: selectedProperty.assessorID,
          inspectionTypes: Array.from(selectedTypes),
          date: selectedDate,
          time: selectedTime,
          notes,
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || `Failed to schedule: ${response.status}`);
      }

      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/schedule-inspection/view`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to schedule inspection. Please try again.");
      setSubmitting(false);
    }
  }

  const allSelected = selectedTypes.size === ALL_TYPE_IDS.length;
  const today = new Date().toISOString().split("T")[0];
  const hasPhone = !!user?.phoneNumber;
  const canSubmit = hasPhone && selectedProperty && selectedDate && selectedTime && selectedTypes.size > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
              <span className="text-zinc-600 dark:text-zinc-400">Loading properties...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
            <p className="text-lg font-medium text-red-600 dark:text-red-400">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-zinc-600 hover:underline dark:text-zinc-400"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100">
              <svg className="h-6 w-6 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Schedule Inspection
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Choose a property, inspection type, and preferred time slot.
            </p>
          </div>

          {/* Section 1 — Select Home */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Select Property
            </label>
            {inventory.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No homes in your inventory.
                </p>
                <Link
                  href="/search"
                  className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Search and add a property
                </Link>
              </div>
            ) : (
              <select
                value={selectedProperty?.assessorID || ""}
                onChange={handlePropertyChange}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
              >
                <option value="">Choose a property...</option>
                {inventory.map((property) => (
                  <option key={property.assessorID || property.id} value={property.assessorID || ""}>
                    {property.formattedAddress ||
                      `${property.addressLine1}, ${property.city}, ${property.state} ${property.zipCode}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Section 2 — Inspection Types */}
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Inspection Types
              </label>
              <button
                type="button"
                onClick={toggleAll}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
            <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
              {selectedTypes.size} of {ALL_TYPE_IDS.length} selected
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {INSPECTION_TYPES.map((type) => {
                const isSelected = selectedTypes.has(type.id);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleType(type.id)}
                    className={`relative flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                        : "border-zinc-200 bg-white opacity-60 hover:opacity-80 dark:border-zinc-700 dark:bg-zinc-800"
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <div
                      className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full ${
                        isSelected
                          ? "bg-blue-500 text-white dark:bg-blue-400"
                          : "border-2 border-zinc-300 dark:border-zinc-600"
                      }`}
                    >
                      {isSelected && (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div
                      className={`mb-2 ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      {type.icon}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isSelected
                          ? "text-zinc-900 dark:text-zinc-100"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {type.name}
                    </span>
                    <span
                      className={`mt-1 text-xs leading-tight ${
                        isSelected
                          ? "text-zinc-600 dark:text-zinc-400"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      {type.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3 — Date & Time */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Preferred Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="mb-6 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
            />

            <label className="mb-3 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Preferred Time Slot
            </label>
            <div className="grid grid-cols-2 gap-3">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4 — Notes */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Notes <span className="font-normal text-zinc-400">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or areas of concern..."
              rows={3}
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
            />
          </div>

          {/* Section 5 — Actions */}
          <div className="flex flex-col gap-3">
            {!hasPhone && (
              <p className="rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                Please add your phone number before scheduling an inspection.
              </p>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-zinc-900 dark:border-t-transparent" />
                  Scheduling...
                </span>
              ) : (
                "Schedule Inspection"
              )}
            </button>
            <Link
              href="/schedule-inspection"
              className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScheduleInspectionCreatePage() {
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
      <ScheduleInspectionContent />
    </Suspense>
  );
}
