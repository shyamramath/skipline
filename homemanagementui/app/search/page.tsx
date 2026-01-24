"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AddressSuggestion, SelectedAddress } from "../types/address";

const SMARTY_KEY = process.env.NEXT_PUBLIC_SMARTY_KEY || "";
const SMARTY_AUTOCOMPLETE_URL = "https://us-autocomplete.api.smarty.com/suggest";

function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function AddressSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (search: string) => {
    if (!search || search.length < 3) {
      setSuggestions([]);
      return;
    }

    if (!SMARTY_KEY) {
      setError("SmartyStreets API key not configured. Add NEXT_PUBLIC_SMARTY_KEY to your environment.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        key: SMARTY_KEY,
        prefix: search,
      });

      const response = await fetch(`${SMARTY_AUTOCOMPLETE_URL}?${params}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setShowDropdown(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch suggestions");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(debounce(fetchSuggestions, 300), [fetchSuggestions]);

  useEffect(() => {
    debouncedFetch(query);
  }, [query, debouncedFetch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectAddress(suggestion: AddressSuggestion) {
    const cityStateZip = [suggestion.city, suggestion.state, suggestion.zipcode]
      .filter(Boolean)
      .join(suggestion.zipcode ? ", " : " ")
      .replace(/, (\d)/, " $1");

    const fullAddress = [
      suggestion.street_line,
      suggestion.secondary,
      `${suggestion.city}, ${suggestion.state}${suggestion.zipcode ? " " + suggestion.zipcode : ""}`,
    ]
      .filter(Boolean)
      .join(", ");

    setSelectedAddress({
      street: suggestion.street_line,
      secondary: suggestion.secondary || undefined,
      city: suggestion.city,
      state: suggestion.state,
      zipcode: suggestion.zipcode || "",
      fullAddress,
    });

    setQuery(fullAddress);
    setShowDropdown(false);
    setSuggestions([]);
  }

  function clearSelection() {
    setSelectedAddress(null);
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Find your home
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Search for a US address to get started ..
          </p>
        </div>

        {/* Search Box */}
        <div className="relative mt-8">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              placeholder="Start typing an address..."
              className="w-full rounded-xl border border-zinc-300 bg-white px-5 py-4 text-lg shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
              </div>
            )}
            {query && !isLoading && (
              <button
                onClick={clearSelection}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-2 w-full rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
            >
              <ul className="max-h-80 overflow-auto py-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleSelectAddress(suggestion)}
                      className="flex w-full flex-col px-5 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700"
                    >
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {suggestion.street_line}
                        {suggestion.secondary && ` ${suggestion.secondary}`}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {suggestion.city}, {suggestion.state} {suggestion.zipcode || ""}
                      </span>
                      {suggestion.entries && suggestion.entries > 1 && (
                        <span className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                          +{suggestion.entries - 1} more entries at this address
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* No API Key Warning */}
        {!SMARTY_KEY && (
          <div className="mt-4 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <p className="font-medium text-amber-700 dark:text-amber-400">API Key Required</p>
            <p className="mt-1 text-sm text-amber-600 dark:text-amber-500">
              Add <code className="rounded bg-amber-100 px-1 dark:bg-amber-800">NEXT_PUBLIC_SMARTY_KEY</code> to your environment variables to enable address search.
            </p>
          </div>
        )}

        {/* Selected Address Card */}
        {selectedAddress && (
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Selected Address
                </h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {selectedAddress.street}
                        {selectedAddress.secondary && `, ${selectedAddress.secondary}`}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipcode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={clearSelection}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    zipcode: selectedAddress.zipcode,
                  });
                  router.push(`/property?${params.toString()}`);
                }}
                className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Use This Address
              </button>
              <button
                onClick={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAddress.fullAddress)}`;
                  window.open(url, "_blank");
                }}
                className="rounded-lg border border-zinc-300 px-4 py-2.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                View on Map
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">How it works</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-green-500">✓</span>
              Start typing any US address to see real-time suggestions
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-green-500">✓</span>
              Select an address from the dropdown to verify and use it
            </li>
            {/* <li className="flex items-start gap-2">
              <span className="mt-1 text-green-500">✓</span>
              Powered by SmartyStreets address verification API
            </li> */}
          </ul>
        </div>
      </main>
    </div>
  );
}
