import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Content */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
                Your Home, <br />
                <span className="text-blue-600 dark:text-blue-400">Our Priority</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Register your home with HomeManager and let our expert handymen take care of all your repair needs. From minor fixes to major renovations, we&apos;ve got you covered.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                <Link
                  href="/search"
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-white transition-colors hover:bg-blue-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Register Your Home
                </Link>
                <Link
                  href="/inventory"
                  className="flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  View My Properties
                </Link>
              </div>
            </div>

            {/* Handyman Image */}
            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 shadow-xl dark:from-blue-900/20 dark:to-zinc-800">
                <Image
                  src="/handyman.jpg"
                  alt="Professional handyman at work"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-white p-4 shadow-lg dark:bg-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">500+</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Homes Serviced</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              How It Works
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Getting your home repaired has never been easier
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Register Your Home
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Search for your address and add your property to our system. It only takes a minute.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Schedule a Visit
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Our expert team will visit your home to assess and identify all repair needs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Get It Fixed
              </h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Sit back and relax while our skilled handymen handle all the repairs professionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Our Services
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Comprehensive home repair and maintenance solutions
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🔧", title: "Plumbing", desc: "Leaks, clogs, installations" },
              { icon: "⚡", title: "Electrical", desc: "Wiring, outlets, fixtures" },
              { icon: "🎨", title: "Painting", desc: "Interior & exterior" },
              { icon: "🪚", title: "Carpentry", desc: "Repairs & installations" },
              { icon: "❄️", title: "HVAC", desc: "Heating & cooling" },
              { icon: "🚪", title: "Doors & Windows", desc: "Repairs & replacements" },
              { icon: "🏠", title: "Roofing", desc: "Repairs & maintenance" },
              { icon: "🧹", title: "General Repairs", desc: "All handyman work" },
            ].map((service, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-3xl">{service.icon}</span>
                <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-200 bg-blue-600 py-16 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Register your home today and let us take care of all your repair needs.
          </p>
          <Link
            href="/search"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            Register Your Home Now
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
