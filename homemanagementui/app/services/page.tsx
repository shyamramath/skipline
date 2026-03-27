"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const SERVICES = [
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Faucets, pipes, drains & water heaters",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m-5-9H5m14 0h-2M7.05 7.05l1.41 1.41m7.08 7.08l1.41 1.41M7.05 16.95l1.41-1.41m7.08-7.08l1.41-1.41M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Wiring, outlets, panels & lighting",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "hvac",
    name: "HVAC",
    description: "Heating, ventilation & air conditioning",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-8-9h1m16 0h1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    id: "painting",
    name: "Painting",
    description: "Interior & exterior painting services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zm0-4h10M9 3v4m6-4v4" />
      </svg>
    ),
  },
  {
    id: "carpentry",
    name: "Carpentry",
    description: "Cabinets, furniture & wood repairs",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.048.58.024 1.194-.14 1.743" />
      </svg>
    ),
  },
  {
    id: "roofing",
    name: "Roofing",
    description: "Roof repair, replacement & inspection",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: "landscaping",
    name: "Landscaping",
    description: "Lawn care, gardens & outdoor spaces",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C8 21 4 17 4 12c0-3 2-6 5-7 0 3 1.5 5 3 6 1.5-1 3-3 3-6 3 1 5 4 5 7 0 5-4 9-8 9z" />
      </svg>
    ),
  },
  {
    id: "pest-control",
    name: "Pest Control",
    description: "Insect & rodent removal services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152-6.135c-.22-2.578-2.022-4.611-4.442-5.274A2.86 2.86 0 0012 2.25a2.86 2.86 0 00-2.613.781c-2.42.663-4.222 2.696-4.442 5.274a23.906 23.906 0 01-1.152 6.135A24.29 24.29 0 0112 12.75z" />
      </svg>
    ),
  },
  {
    id: "appliance-repair",
    name: "Appliance Repair",
    description: "Washer, dryer, fridge & oven repair",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
      </svg>
    ),
  },
  {
    id: "general-maintenance",
    name: "General Maintenance",
    description: "Odd jobs, repairs & home upkeep",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
] as const;

const ALL_SERVICE_IDS = SERVICES.map((s) => s.id);

function ServicesContent() {
  const searchParams = useSearchParams();
  const assessorId = searchParams.get("assessorId");

  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    () => new Set(ALL_SERVICE_IDS)
  );
  const [saving, setSaving] = useState(false);
  const [propertyAddress, setPropertyAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!assessorId) return;

    async function fetchPropertyAddress() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/home/details/${encodeURIComponent(assessorId!)}`
        );
        if (response.ok) {
          const data = await response.json();
          const property = Array.isArray(data) ? data[0] : data;
          if (property?.formattedAddress) {
            setPropertyAddress(property.formattedAddress);
          } else if (property?.addressLine1) {
            setPropertyAddress(
              `${property.addressLine1}, ${property.city}, ${property.state} ${property.zipCode}`
            );
          }
        }
      } catch {
        // Silently fail — header will just omit the address
      }
    }

    fetchPropertyAddress();
  }, [assessorId]);

  function toggleService(id: string) {
    setSelectedServices((prev) => {
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
    if (selectedServices.size === ALL_SERVICE_IDS.length) {
      setSelectedServices(new Set());
    } else {
      setSelectedServices(new Set(ALL_SERVICE_IDS));
    }
  }

  async function handleSave() {
    setSaving(true);

    try {
      // TODO: Implement actual save services API call
      console.log("Save services:", {
        assessorId,
        selectedServices: Array.from(selectedServices),
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to inventory on success
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/inventory`;
    } catch {
      setSaving(false);
    }
  }

  const allSelected = selectedServices.size === ALL_SERVICE_IDS.length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100">
              <span className="text-xl font-bold text-white dark:text-zinc-900">H</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {propertyAddress
                ? `Select Services for ${propertyAddress}`
                : "Select Services"}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Choose the handyman services you need. You can change these later.
            </p>
          </div>

          {/* Select All / Deselect All */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {selectedServices.size} of {ALL_SERVICE_IDS.length} selected
            </p>
            <button
              type="button"
              onClick={toggleAll}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          {/* Service Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SERVICES.map((service) => {
              const isSelected = selectedServices.has(service.id);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
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
                    {service.icon}
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isSelected
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {service.name}
                  </span>
                  <span
                    className={`mt-1 text-xs leading-tight ${
                      isSelected
                        ? "text-zinc-600 dark:text-zinc-400"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {service.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-zinc-900 dark:border-t-transparent" />
                  Saving...
                </span>
              ) : (
                "Save Services"
              )}
            </button>
            <Link
              href="/inventory"
              className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Skip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
            <span className="text-zinc-600 dark:text-zinc-400">Loading services...</span>
          </div>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
