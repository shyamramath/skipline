import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 px-16 py-32">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Home Management
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Manage and view your home details
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href="/search"
            className="flex h-12 items-center justify-center rounded-full bg-black px-8 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Search Address
          </Link>
          <Link
            href="/homes"
            className="flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            View Homes
          </Link>
          <Link
            href="/property"
            className="flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            View Property Details
          </Link>
        </div>
      </main>
    </div>
  );
}
