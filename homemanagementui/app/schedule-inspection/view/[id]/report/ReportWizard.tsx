"use client";

import { useState } from "react";
import Link from "next/link";

interface ReportFinding {
  area: string;
  condition: "good" | "fair" | "poor";
  notes: string;
}

interface ReportSection {
  type: string;
  summary: string;
  findings: ReportFinding[];
}

export interface ReportData {
  inspectionId: string;
  address: string;
  date: string;
  time: string;
  inspector: string;
  inspectionTypes: string[];
  overallCondition: "good" | "fair" | "poor";
  overallSummary: string;
  sections: ReportSection[];
}

const CONDITION_STYLES: Record<
  ReportFinding["condition"],
  { label: string; dot: string; text: string }
> = {
  good: {
    label: "Good",
    dot: "bg-green-500",
    text: "text-green-700 dark:text-green-400",
  },
  fair: {
    label: "Fair",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  },
  poor: {
    label: "Poor",
    dot: "bg-red-500",
    text: "text-red-700 dark:text-red-400",
  },
};

const OVERALL_STYLES: Record<
  ReportData["overallCondition"],
  { label: string; classes: string }
> = {
  good: {
    label: "Good Condition",
    classes: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  },
  fair: {
    label: "Fair Condition",
    classes: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  },
  poor: {
    label: "Poor Condition",
    classes: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Step Components ────────────────────────────────────────

function OverviewStep({ report }: { report: ReportData }) {
  const overall = OVERALL_STYLES[report.overallCondition];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Report Overview
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {report.inspectionId}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${overall.classes}`}
        >
          {overall.label}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Property
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {report.address}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Inspector
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {report.inspector}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Date
          </p>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
            {formatDate(report.date)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Time
          </p>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
            {report.time}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Inspection Types
        </p>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {report.inspectionTypes.map((type) => (
            <span
              key={type}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Overall Summary
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {report.overallSummary}
        </p>
      </div>
    </div>
  );
}

function SectionStep({ section }: { section: ReportSection }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-8 py-5 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {section.type} Inspection
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {section.summary}
        </p>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {section.findings.map((finding) => {
          const cond = CONDITION_STYLES[finding.condition];
          return (
            <div key={finding.area} className="px-8 py-4">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {finding.area}
                </h3>
                <span
                  className={`flex items-center gap-1.5 text-xs font-medium ${cond.text}`}
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${cond.dot}`}
                  />
                  {cond.label}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {finding.notes}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionsStep({ report }: { report: ReportData }) {
  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    const element = document.getElementById("report-content");
    if (!element) return;

    const blob = new Blob([element.innerText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inspection-report-${report.inspectionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleEmail() {
    const subject = encodeURIComponent(
      `Inspection Report — ${report.address}`
    );
    const body = encodeURIComponent(
      `Hi,\n\nPlease find the inspection report for ${report.address} (${report.inspectionId}).\n\nView the full report here: ${window.location.href}\n\nBest regards`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 text-center">
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
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Report Complete
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          You&apos;ve reviewed all sections for{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {report.address}
          </span>
          . Choose an action below.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Email */}
        <button
          onClick={handleEmail}
          className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-4 text-left transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Email Report
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Send the report link via your email client
            </p>
          </div>
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-4 text-left transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Download Report
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Save the report as a file to your device
            </p>
          </div>
        </button>

        {/* Print */}
        <button
          onClick={handlePrint}
          className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-4 text-left transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 6.034V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v2.659"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Print Report
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Print the full inspection report
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Wizard ─────────────────────────────────────────────────

export default function ReportWizard({ report }: { report: ReportData }) {
  // Steps: Overview → each section → Actions
  const totalSteps = 1 + report.sections.length + 1;
  const [currentStep, setCurrentStep] = useState(0);

  const stepLabels = [
    "Overview",
    ...report.sections.map((s) => s.type),
    "Actions",
  ];

  function goNext() {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }

  function goBack() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div id="report-content">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Inspection Report
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                i === currentStep
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : i < currentStep
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
              }`}
            >
              {i < currentStep ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </button>
            {i < stepLabels.length - 1 && (
              <div
                className={`hidden h-0.5 w-6 sm:block ${
                  i < currentStep
                    ? "bg-green-300 dark:bg-green-700"
                    : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 0 && <OverviewStep report={report} />}
        {currentStep > 0 &&
          currentStep <= report.sections.length && (
            <SectionStep section={report.sections[currentStep - 1]} />
          )}
        {isLast && <ActionsStep report={report} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          {!isFirst && (
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Back
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/schedule-inspection/view"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Exit
          </Link>
          {!isLast && (
            <button
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
