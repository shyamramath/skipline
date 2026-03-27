"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PaymentModal from "../components/PaymentModal";

interface InspectionPlan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  icon: string;
  features: string[];
  popular?: boolean;
}

interface MaintenancePlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  icon: string;
  features: string[];
  popular?: boolean;
}

const inspectionPlans: InspectionPlan[] = [
  {
    id: "basic",
    name: "Basic Inspection",
    tagline: "Essential home checkup",
    price: 199,
    icon: "🏠",
    features: [
      "Visual inspection of major systems",
      "Roof and exterior walkthrough",
      "Plumbing fixtures check",
      "Electrical panel review",
      "HVAC basic assessment",
      "Digital report within 48 hours",
    ],
  },
  {
    id: "standard",
    name: "Standard Inspection",
    tagline: "Comprehensive home analysis",
    price: 349,
    icon: "🔍",
    popular: true,
    features: [
      "Everything in Basic, plus:",
      "Foundation & structural review",
      "Attic & insulation inspection",
      "Full HVAC testing",
      "Appliance functionality test",
      "Moisture & leak detection",
      "Photo-documented report",
      "30-minute consultation call",
    ],
  },
  {
    id: "premium",
    name: "Premium Inspection",
    tagline: "Complete property deep-dive",
    price: 549,
    icon: "⭐",
    features: [
      "Everything in Standard, plus:",
      "Thermal imaging scan",
      "Radon gas testing",
      "Mold & air quality test",
      "Termite/pest inspection",
      "Sewer line camera scope",
      "Pool & spa inspection",
      "90-day warranty coverage",
      "Priority same-day scheduling",
    ],
  },
];

const maintenancePlans: MaintenancePlan[] = [
  {
    id: "essential",
    name: "Essential Care",
    tagline: "Annual peace of mind",
    monthlyPrice: 29,
    yearlyPrice: 299,
    icon: "📅",
    features: [
      "1 annual full inspection",
      "Seasonal maintenance reminders",
      "Email support",
      "10% off repair services",
      "Digital maintenance log",
    ],
  },
  {
    id: "plus",
    name: "Home Care Plus",
    tagline: "Quarterly protection",
    monthlyPrice: 59,
    yearlyPrice: 599,
    icon: "🛡️",
    popular: true,
    features: [
      "4 quarterly inspections",
      "Priority scheduling",
      "Phone & email support",
      "15% off repair services",
      "1 emergency visit/year",
      "Appliance check included",
      "Handyman referral network",
    ],
  },
  {
    id: "total",
    name: "Total Home Care",
    tagline: "Complete protection plan",
    monthlyPrice: 99,
    yearlyPrice: 999,
    icon: "👑",
    features: [
      "Monthly inspection visits",
      "Unlimited support calls",
      "24/7 emergency hotline",
      "20% off all repairs",
      "2 emergency visits/year",
      "4 handyman hours included",
      "Appliance warranty add-on",
      "Dedicated home advisor",
    ],
  },
];

type TabType = "inspection" | "maintenance";
type BillingType = "monthly" | "yearly";

interface SelectedPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  type: "inspection" | "maintenance";
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("inspection");
  const [billing, setBilling] = useState<BillingType>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  function handleSelectPlan(
    planId: string,
    planName: string,
    price: number,
    planType: "inspection" | "maintenance"
  ) {
    setSelectedPlan({
      id: planId,
      name: planName,
      price,
      period: planType === "inspection" ? "one-time" : billing,
      type: planType,
    });
    setIsPaymentModalOpen(true);
  }

  function handlePaymentSuccess() {
    router.push("/subscription/success");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Home Inspection Plans
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Professional inspection packages tailored to your needs
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-xl bg-zinc-100 p-1.5 dark:bg-zinc-800">
            <button
              onClick={() => setActiveTab("inspection")}
              className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
                activeTab === "inspection"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              One-Time Inspection
            </button>
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
                activeTab === "maintenance"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              Maintenance Plans
            </button>
          </div>
        </div>

        {/* Billing Toggle for Maintenance */}
        {activeTab === "maintenance" && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                billing === "monthly"
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
              className="relative h-7 w-14 rounded-full bg-zinc-200 transition-colors dark:bg-zinc-700"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-blue-600 transition-transform ${
                  billing === "yearly" ? "left-8" : "left-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                billing === "yearly"
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              Yearly
            </span>
            {billing === "yearly" && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Save 15%
              </span>
            )}
          </div>
        )}

        {/* Plans Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {activeTab === "inspection"
            ? inspectionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border p-6 transition-all hover:shadow-lg ${
                    plan.popular
                      ? "border-blue-500 bg-white shadow-md dark:border-blue-400 dark:bg-zinc-900"
                      : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="mb-3 text-4xl">{plan.icon}</div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {plan.tagline}
                    </p>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                        ${plan.price}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400">/inspection</span>
                    </div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <svg
                          className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
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
                        <span className="text-zinc-600 dark:text-zinc-400">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan.id, plan.name, plan.price, "inspection")}
                    className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
                      plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    }`}
                  >
                    Book Inspection
                  </button>
                </div>
              ))
            : maintenancePlans.map((plan) => {
                const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
                const period = billing === "monthly" ? "month" : "year";

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl border p-6 transition-all hover:shadow-lg ${
                      plan.popular
                        ? "border-blue-500 bg-white shadow-md dark:border-blue-400 dark:bg-zinc-900"
                        : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                          Best Value
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <div className="mb-3 text-4xl">{plan.icon}</div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {plan.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {plan.tagline}
                      </p>
                      <div className="mt-4 flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                          ${price}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400">/{period}</span>
                      </div>
                    </div>

                    <ul className="mt-6 flex-1 space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <svg
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
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
                          <span className="text-zinc-600 dark:text-zinc-400">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan.id, plan.name, price, "maintenance")}
                      className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
                        plan.popular
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      }`}
                    >
                      Subscribe Now
                    </button>
                  </div>
                );
              })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                q: "How long does an inspection take?",
                a: "A typical inspection takes 2-4 hours depending on the size of your home and the package selected.",
              },
              {
                q: "When will I receive my report?",
                a: "Basic reports are delivered within 48 hours. Standard and Premium include same-day summaries with full reports within 24 hours.",
              },
              {
                q: "Can I attend the inspection?",
                a: "Absolutely! We encourage homeowners to be present. It's a great learning opportunity and you can ask questions in real-time.",
              },
              {
                q: "What's covered under the warranty?",
                a: "Premium inspections include a 90-day warranty covering any issues we may have missed during the initial inspection.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{faq.q}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Need help choosing?</h2>
          <p className="mt-2 text-blue-100">
            Contact us for a free consultation and we&apos;ll recommend the best package for your home.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/search"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              Register Your Home
            </Link>
            <button className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
              Call (512) 555-0123
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            All inspections performed by certified professionals. Licensed & insured.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-zinc-400">
            <span>✓ Licensed Inspectors</span>
            <span>✓ Same-Day Scheduling</span>
            <span>✓ Satisfaction Guaranteed</span>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          planPeriod={selectedPlan.period}
          planType={selectedPlan.type}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
