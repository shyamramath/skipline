import Link from "next/link";
import { APP_CONFIG } from "../config/app.config";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 dark:bg-zinc-100">
              <span className="text-xs font-bold text-white dark:text-zinc-900">{APP_CONFIG.logo}</span>
            </div>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/search"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Search
            </Link>
            <Link
              href="/inventory"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Inventory
            </Link>
            <Link
              href="/property"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Property
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
