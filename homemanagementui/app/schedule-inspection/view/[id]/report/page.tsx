import Link from "next/link";
import ReportWizard, { type ReportData } from "./ReportWizard";

const MOCK_REPORTS: Record<string, ReportData> = {
  "insp-003": {
    inspectionId: "insp-003",
    address: "910 Maple Dr, Elk Grove, CA 95624",
    date: "2026-01-28",
    time: "3:00 PM – 6:00 PM",
    inspector: "James Whitfield",
    inspectionTypes: ["General", "Pest Control"],
    overallCondition: "good",
    overallSummary:
      "The property is in good overall condition. Minor cosmetic wear was noted in a few areas. No structural concerns or active pest infestations were found. Routine maintenance is recommended to keep the home in excellent shape.",
    sections: [
      {
        type: "General",
        summary:
          "Full walkthrough completed. The home is well-maintained with only minor items requiring attention.",
        findings: [
          {
            area: "Foundation",
            condition: "good",
            notes: "No visible cracks or settling. Grading slopes away from the foundation as expected.",
          },
          {
            area: "Exterior Walls",
            condition: "good",
            notes: "Stucco is intact with no signs of moisture intrusion. Paint is in good condition.",
          },
          {
            area: "Windows & Doors",
            condition: "fair",
            notes: "Minor weather-stripping wear on the front door. Two bedroom windows have slight seal fog — recommend monitoring.",
          },
          {
            area: "Interior Floors",
            condition: "good",
            notes: "Hardwood floors in living areas are in great shape. Tile grout in the kitchen is clean and sealed.",
          },
          {
            area: "Attic",
            condition: "good",
            notes: "Insulation is adequate (R-30). No signs of moisture, mold, or rodent activity.",
          },
          {
            area: "Garage",
            condition: "fair",
            notes: "Minor oil staining on the concrete floor. Garage door opener functions properly. Weather seal at base is slightly worn.",
          },
        ],
      },
      {
        type: "Pest Control",
        summary:
          "No active infestations detected. Preventive measures are in place and functioning well.",
        findings: [
          {
            area: "Termite Inspection",
            condition: "good",
            notes: "No evidence of subterranean or drywood termites. Previous bait stations are intact and monitored.",
          },
          {
            area: "Rodent Activity",
            condition: "good",
            notes: "No droppings, gnaw marks, or nesting materials found in attic, crawlspace, or garage.",
          },
          {
            area: "Exterior Perimeter",
            condition: "fair",
            notes: "Minor ant trails observed near the south-facing patio. Recommend perimeter spray treatment as a preventive measure.",
          },
          {
            area: "Crawlspace",
            condition: "good",
            notes: "Vapor barrier is intact. No moisture buildup or pest activity detected.",
          },
        ],
      },
    ],
  },
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = MOCK_REPORTS[id];

  if (!report) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Report not found
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              No inspection report exists for this ID.
            </p>
            <Link
              href="/schedule-inspection/view"
              className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Back to Inspections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <ReportWizard report={report} />
      </div>
    </div>
  );
}
