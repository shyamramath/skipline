import Link from "next/link";

interface MockInspection {
  id: string;
  address: string;
  inspectionTypes: string[];
  date: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed";
  notes?: string;
}

const MOCK_INSPECTIONS: MockInspection[] = [
  {
    id: "insp-001",
    address: "1234 Elm St, Sacramento, CA 95814",
    inspectionTypes: ["General", "Roof", "HVAC"],
    date: "2026-02-15",
    time: "9:00 AM – 12:00 PM",
    status: "scheduled",
    notes: "Check attic insulation and roof flashing near chimney.",
  },
  {
    id: "insp-002",
    address: "5678 Oak Ave, Sacramento, CA 95816",
    inspectionTypes: ["Plumbing", "Electrical"],
    date: "2026-02-10",
    time: "12:00 PM – 3:00 PM",
    status: "in-progress",
  },
  {
    id: "insp-003",
    address: "910 Maple Dr, Elk Grove, CA 95624",
    inspectionTypes: ["General", "Pest Control"],
    date: "2026-01-28",
    time: "3:00 PM – 6:00 PM",
    status: "completed",
    notes: "Annual routine inspection.",
  },
  {
    id: "insp-004",
    address: "2200 Pine Ln, Folsom, CA 95630",
    inspectionTypes: ["Roof"],
    date: "2026-02-20",
    time: "9:00 AM – 12:00 PM",
    status: "scheduled",
  },
];

const STATUS_STYLES: Record<MockInspection["status"], { label: string; classes: string }> = {
  scheduled: {
    label: "Scheduled",
    classes: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  },
  "in-progress": {
    label: "In Progress",
    classes: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  },
  completed: {
    label: "Completed",
    classes: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ViewInspectionsPage() {
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

        {/* Inspection List */}
        <div className="flex flex-col gap-4">
          {MOCK_INSPECTIONS.map((inspection) => {
            const status = STATUS_STYLES[inspection.status];
            return (
              <div
                key={inspection.id}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                {/* Top row: address + status */}
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {inspection.address}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.classes}`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="mb-3 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                    {formatDate(inspection.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {inspection.time}
                  </span>
                </div>

                {/* Inspection type badges */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {inspection.inspectionTypes.map((type) => (
                    <span
                      key={type}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* Notes */}
                {inspection.notes && (
                  <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
                    {inspection.notes}
                  </p>
                )}

                {/* View Report — only for completed inspections */}
                {inspection.status === "completed" && (
                  <div className={inspection.notes ? "" : "mt-4"}>
                    <Link
                      href={`/schedule-inspection/view/${inspection.id}/report`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                      View Report
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

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
