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
              {APP_CONFIG.name} was born out of a frustrating personal experience. In 2018, our founder
              Michael Chen purchased his first home—a charming 1960s ranch in Austin, Texas.
              Within six months, he discovered a hidden water leak that had been slowly damaging
              the foundation for years. The repair cost over $40,000 and could have been prevented
              with a thorough inspection.
            </p>
            <p>
              That experience sparked a mission: to make professional home inspections accessible,
              transparent, and truly comprehensive. Michael partnered with his college roommate
              Sarah Martinez, a licensed structural engineer, and together they built what would
              become {APP_CONFIG.name}.
            </p>
            <p>
              What started as a two-person operation working out of a garage has grown into a
              trusted home inspection and maintenance company serving thousands of homeowners
              across Texas. But our core mission remains the same—helping people protect their
              homes and avoid costly surprises.
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
                bio: "Former software engineer turned home inspection advocate. Michael brings a tech-forward approach to traditional home services, ensuring our clients get detailed, data-driven insights about their properties.",
                image: "👨‍💼",
              },
              {
                name: "Sarah Martinez",
                role: "Co-Founder & Chief Inspector",
                bio: "Licensed structural engineer with 15+ years of experience. Sarah leads our inspection team and has personally trained every inspector on staff to meet her exacting standards.",
                image: "👩‍🔬",
              },
              {
                name: "David Thompson",
                role: "Head of Operations",
                bio: "With a background in hospitality management, David ensures every client interaction exceeds expectations. He's the reason our scheduling is seamless and our reports arrive on time.",
                image: "👨‍💻",
              },
              {
                name: "Lisa Park",
                role: "Lead Technology Officer",
                bio: "Lisa built our proprietary inspection platform from the ground up. Her innovations have cut report delivery time by 60% while increasing detail and accuracy.",
                image: "👩‍💻",
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
                year: "2019",
                title: "The Beginning",
                description:
                  "{APP_CONFIG.name} founded in Austin, TX. First inspection completed in Michael's own neighborhood.",
              },
              {
                year: "2020",
                title: "Going Digital",
                description:
                  "Launched our digital inspection platform, enabling detailed photo documentation and instant report delivery.",
              },
              {
                year: "2021",
                title: "Team Expansion",
                description:
                  "Grew from 2 to 15 team members. Introduced maintenance subscription plans.",
              },
              {
                year: "2022",
                title: "Regional Growth",
                description:
                  "Expanded services to Houston, Dallas, and San Antonio. Completed our 5,000th inspection.",
              },
              {
                year: "2023",
                title: "Innovation Award",
                description:
                  "Received Texas Home Inspection Association's Innovation Award for our thermal imaging program.",
              },
              {
                year: "2024",
                title: "Looking Forward",
                description:
                  "Launched QR-code property tracking and mobile app. Planning expansion to neighboring states.",
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
