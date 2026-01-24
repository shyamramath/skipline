"use client";

import { useState } from "react";
import Link from "next/link";

type BillingPeriod = "monthly" | "yearly";

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Basic",
    description: "Perfect for getting started with property management",
    monthlyPrice: 50,
    yearlyPrice: 600,
    features: [
      "Up to 5 properties",
      "Basic property details",
      "QR code generation",
      "Email support",
    ],
  },
  {
    name: "Gold",
    description: "Best for growing property portfolios",
    monthlyPrice: 100,
    yearlyPrice: 500,
    features: [
      "Unlimited properties",
      "Advanced property analytics",
      "QR code generation",
      "Tax assessment tracking",
      "Owner information lookup",
      "Priority support",
      "Export to PDF/CSV",
    ],
    highlighted: true,
  },
  {
    name: "Platinum",
    description: "Enterprise-grade features for professionals",
    monthlyPrice: 75,
    yearlyPrice: 750,
    features: [
      "Everything in Gold",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced reporting",
      "Multi-user access",
      "White-label options",
      "24/7 phone support",
    ],
  },
];

export default function SubscriptionPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Select the perfect plan for your property management needs
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span
            className={`text-sm font-medium ${
              billingPeriod === "monthly"
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")
            }
            className="relative h-7 w-14 rounded-full bg-zinc-200 transition-colors dark:bg-zinc-700"
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-zinc-900 transition-transform dark:bg-zinc-100 ${
                billingPeriod === "yearly" ? "left-8" : "left-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              billingPeriod === "yearly"
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            Yearly
          </span>
          {billingPeriod === "yearly" && (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Save up to 58%
            </span>
          )}
        </div>

        {/* Plans Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const price =
              billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const period = billingPeriod === "monthly" ? "month" : "year";

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-zinc-900 bg-white shadow-xl dark:border-zinc-100 dark:bg-zinc-900"
                    : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {plan.name}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {plan.description}
                  </p>

                  <div className="mt-6">
                    <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">
                      ${price}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      /{period}
                    </span>
                  </div>

                  {billingPeriod === "yearly" && plan.name === "Gold" && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Save $700/year compared to monthly
                    </p>
                  )}
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg
                        className={`h-5 w-5 flex-shrink-0 ${
                          plan.highlighted
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-500 dark:text-zinc-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      : "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-zinc-500 hover:text-zinc-700 hover:underline dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
