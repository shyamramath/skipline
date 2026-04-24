"use client";

import Link from "next/link";
import { APP_CONFIG } from "../config/app.config";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 md:text-5xl">
            About {APP_CONFIG.name}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Helping homeowners protect their biggest investment since 2019
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Our Story
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              {APP_CONFIG.name} was born from a journey that spans three countries and decades of
              hands-on experience. Our founder, Sathyan Meethal, spent his formative years in India
              before relocating to Kuwait, where he lived and worked for fourteen years.
            </p>
            <p>
              Sathyan later transitioned to the United States, where he gained extensive experience
              working with multiple companies and contributed significantly to maintaining and
              repairing homes across numerous American neighborhoods. Over the years, he witnessed
              firsthand the challenges homeowners face in keeping their properties in top condition—
              and the trust that is built when a neighbor shows up and does the job right.
            </p>
            <p>
              Inspired by that hands-on experience and a deep sense of community, Sathyan envisioned
              a company that could bring reliability, transparency, and care to home maintenance
              management. That vision gave rise to {APP_CONFIG.name}—a name that reflects trust,
              community connection, and the belief that every homeowner deserves a dependable
              neighbor they can count on.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Our Mission
          </h2>
          <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
            To empower homeowners with the knowledge and tools they need to maintain, protect,
            and maximize the value of their homes.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "🔍",
                title: "Transparency",
                description:
                  "We believe in complete honesty. Our reports tell you exactly what we find—the good and the bad.",
              },
              {
                icon: "🎓",
                title: "Education",
                description:
                  "We don't just inspect; we teach. Every homeowner should understand their property inside and out.",
              },
              {
                icon: "🤝",
                title: "Integrity",
                description:
                  "We never recommend unnecessary repairs. Our only goal is your home's wellbeing.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-3 text-3xl">{value.icon}</div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The Team */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Meet Our Leadership
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {[
              {
                name: "Sathyan Meethal",
                role: "Co-Founder & CEO",
                bio: "Having spent my formative years relocating from India to Kuwait, where I resided for fourteen years, I later transitioned to the United States and gained extensive experience working with multiple companies. Throughout this journey, I contributed significantly to maintaining and repairing homes across numerous American neighborhoods. Inspired by this hands-on experience, I envisioned establishing a home maintenance management company—thus giving rise to the name \"ANEIGHBOR,\" reflecting trust, reliability, and community connection.",
                image: "👨‍💼",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-3xl dark:bg-zinc-800">
                  {member.image}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {member.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{member.role}</p>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* By the Numbers */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            By the Numbers
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "10,000+", label: "Inspections Completed" },
              { value: "98%", label: "Customer Satisfaction" },
              { value: "25+", label: "Certified Inspectors" },
              { value: "5", label: "Years in Business" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Our Journey
          </h2>
          <div className="mt-8 space-y-6">
            {[
              {
                year: "2000",
                title: "Roots in India & Kuwait",
                description:
                  "Sathyan Meethal grew up in India before relocating to Kuwait, where he lived and worked for fourteen years, building resilience and a strong work ethic.",
              },
              {
                year: "2014",
                title: "A New Chapter in America",
                description:
                  "Sathyan transitioned to the United States, joining multiple companies and immersing himself in the American home maintenance and repair industry.",
              },
              {
                year: "2018",
                title: "Hands-On Experience",
                description:
                  "After years of contributing to maintaining and repairing homes across numerous American neighborhoods, Sathyan recognized a gap in reliable, community-focused home management services.",
              },
              {
                year: "2021",
                title: "The Vision Takes Shape",
                description:
                  "Inspired by his journey and the trust built with homeowners along the way, Sathyan conceived ANEIGHBOR—a company rooted in reliability, care, and community connection.",
              },
              {
                year: "2023",
                title: "ANEIGHBOR is Born",
                description:
                  "ANEIGHBOR was officially founded in Texas, offering home inspection and maintenance management services built on the values of trust and neighborly care.",
              },
              {
                year: "2024",
                title: "Growing the Community",
                description:
                  "Launched digital property tracking, QR-code management, and an online platform to empower homeowners across Texas to manage their homes with confidence.",
              },
            ].map((milestone, index) => (
              <div key={milestone.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {milestone.year.slice(2)}
                  </div>
                  {index < 5 && (
                    <div className="h-full w-0.5 bg-zinc-200 dark:bg-zinc-700" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {milestone.year}
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {milestone.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to protect your home?</h2>
          <p className="mt-2 text-blue-100">
            Join thousands of homeowners who trust {APP_CONFIG.name} with their biggest investment.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/subscription"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              View Our Plans
            </Link>
            <Link
              href="/search"
              className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Register Your Home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
