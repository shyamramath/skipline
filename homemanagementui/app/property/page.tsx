"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Property } from "../types/property";
import { apiFetch } from "../lib/apiFetch";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null) return null;
  return (
    <div className="flex justify-between border-b border-zinc-100 py-2 last:border-0 dark:border-zinc-800">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="font-medium text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "info" }) {
  const colors = {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
      <span className="text-2xl">{icon}</span>
      <span className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</span>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

function PropertyContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Get URL params
  const assessorId = searchParams.get("assessorId");
  const searchedAddress = {
    street: searchParams.get("street"),
    city: searchParams.get("city"),
    state: searchParams.get("state"),
    zipcode: searchParams.get("zipcode"),
  };
  const hasSearchedAddress = searchedAddress.street && searchedAddress.city;

  async function handleAddToInventory() {
    if (!property) return;

    setSaveStatus("saving");
    setSaveMessage(null);

    try {
      const response = await apiFetch(`${API_BASE_URL}/api/home/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(property),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || `Failed to save: ${response.status}`);
      }

      setSaveStatus("success");
      setSaveMessage(responseText || "Property added to inventory successfully!");

      // Redirect to services page for this property
      window.location.href = property.assessorID
        ? `${BASE_PATH}/services?assessorId=${encodeURIComponent(property.assessorID)}`
        : `${BASE_PATH}/services`;
    } catch (err) {
      setSaveStatus("error");
      setSaveMessage(err instanceof Error ? err.message : "Failed to save property");

      // Reset error after 5 seconds
      setTimeout(() => {
        setSaveMessage(null);
        setSaveStatus("idle");
      }, 5000);
    }
  }

  useEffect(() => {
    async function fetchProperty() {
      try {
        let response;

        if (assessorId) {
          // Fetch by assessorId from inventory
          response = await fetch(
            `${API_BASE_URL}/api/home/details/${encodeURIComponent(assessorId)}`
          );
        } else if (hasSearchedAddress) {
          // Fetch by address from search - POST with JSON payload
          const formattedAddress = `${searchedAddress.street}, ${searchedAddress.city}, ${searchedAddress.state} ${searchedAddress.zipcode || ""}`.trim();
          response = await fetch(`${API_BASE_URL}/api/home/property`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ address: formattedAddress }),
          });
        } else {
          // Fallback to dummy property
          response = await fetch(`${API_BASE_URL}/api/home/dummyproperty`);
        }

        if (response.status === 401) {
          throw new Error("MAINTENANCE");
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        console.log("Property API Response:", data);
        setProperty(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [assessorId, hasSearchedAddress, searchedAddress.street, searchedAddress.city, searchedAddress.state, searchedAddress.zipcode]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
          <span className="text-zinc-600 dark:text-zinc-400">Loading property details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    const isMaintenance = error === "MAINTENANCE";
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md px-6">
          <div className={`rounded-2xl border p-8 text-center shadow-sm ${
            isMaintenance
              ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
              : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20"
          }`}>
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
              isMaintenance ? "bg-amber-100 dark:bg-amber-900/40" : "bg-red-100 dark:bg-red-900/40"
            }`}>
              {isMaintenance ? (
                <svg className="h-7 w-7 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              ) : (
                <svg className="h-7 w-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            </div>
            <h2 className={`text-xl font-bold ${
              isMaintenance ? "text-amber-800 dark:text-amber-300" : "text-red-700 dark:text-red-400"
            }`}>
              {isMaintenance ? "Under Maintenance" : "Something went wrong"}
            </h2>
            <p className={`mt-2 text-sm ${
              isMaintenance ? "text-amber-700 dark:text-amber-400" : "text-red-600 dark:text-red-400"
            }`}>
              {isMaintenance
                ? "Property search is not available due to maintenance work. Please try again later."
                : error}
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const taxAssessments = property.taxAssessments
    ? Object.values(property.taxAssessments).sort((a, b) => b.year - a.year)
    : [];
  const propertyTaxes = property.propertyTaxes
    ? Object.values(property.propertyTaxes).sort((a, b) => b.year - a.year)
    : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {/* Top bar with Add to Inventory button */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {property.propertyType && <Badge variant="info">{property.propertyType}</Badge>}
              {property.ownerOccupied && <Badge variant="success">Owner Occupied</Badge>}
              {hasSearchedAddress && <Badge variant="success">Searched</Badge>}
            </div>
            {!user?.phoneNumber && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Add your phone number to enable this action.
              </p>
            )}
            <button
              onClick={handleAddToInventory}
              disabled={!user?.phoneNumber || saveStatus === "saving" || saveStatus === "success"}
              title={!user?.phoneNumber ? "Please add your phone number first" : undefined}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                saveStatus === "success"
                  ? "bg-green-600 text-white"
                  : saveStatus === "saving"
                  ? "bg-zinc-400 text-white cursor-wait"
                  : !user?.phoneNumber
                  ? "bg-zinc-300 text-zinc-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500"
                  : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              }`}
            >
              {saveStatus === "saving" ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : saveStatus === "success" ? (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to Inventory
                </>
              )}
            </button>
          </div>

          {/* Success/Error Message */}
          {saveMessage && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm ${
                saveStatus === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {saveMessage}
            </div>
          )}

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {hasSearchedAddress ? searchedAddress.street : property.addressLine1}
              </h1>
              <p className="mt-1 text-lg text-zinc-500 dark:text-zinc-400">
                {hasSearchedAddress
                  ? `${searchedAddress.city}, ${searchedAddress.state} ${searchedAddress.zipcode || ""}`
                  : `${property.city}, ${property.state} ${property.zipCode}`}
              </p>
              {property.county && (
                <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                  {property.county} County
                </p>
              )}
            </div>
            {property.lastSaleDate && (
              <div className="text-right">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Last Sale</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {new Date(property.lastSaleDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {property.bedrooms != null && <StatCard icon="🛏️" label="Bedrooms" value={property.bedrooms} />}
            {property.bathrooms != null && <StatCard icon="🚿" label="Bathrooms" value={property.bathrooms} />}
            {property.squareFootage != null && <StatCard icon="📐" label="Sq Ft" value={property.squareFootage.toLocaleString()} />}
            {property.lotSize != null && <StatCard icon="🏡" label="Lot Size" value={`${property.lotSize.toLocaleString()} sqft`} />}
            {property.yearBuilt != null && <StatCard icon="📅" label="Year Built" value={property.yearBuilt} />}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Property Features */}
          {property.features && (
            <Section title="Property Features">
              <div className="space-y-1">
                <InfoRow label="Architecture Type" value={property.features.architectureType} />
                <InfoRow label="Floor Count" value={property.features.floorCount} />
                <InfoRow label="Foundation" value={property.features.foundationType} />
                <InfoRow label="Cooling" value={property.features.cooling ? property.features.coolingType : "None"} />
                <InfoRow label="Heating" value={property.features.heating ? property.features.heatingType : "None"} />
                <InfoRow label="Garage" value={property.features.garage ? property.features.garageType : "None"} />
              </div>
            </Section>
          )}

          {/* Owner Information */}
          {property.owner && (
            <Section title="Owner Information">
              <div className="space-y-4">
                {property.owner.names && (
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Owner Names</p>
                    <div className="mt-1 space-y-1">
                      {property.owner.names.map((name, i) => (
                        <p key={i} className="font-medium text-zinc-900 dark:text-zinc-100">{name}</p>
                      ))}
                    </div>
                  </div>
                )}
                {property.owner.mailingAddress && (
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Mailing Address</p>
                    <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
                      {property.owner.mailingAddress.formattedAddress}
                    </p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Tax Assessments */}
          {taxAssessments.length > 0 && (
            <Section title="Tax Assessments">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="py-2 text-left font-medium text-zinc-500 dark:text-zinc-400">Year</th>
                      <th className="py-2 text-right font-medium text-zinc-500 dark:text-zinc-400">Total Value</th>
                      <th className="py-2 text-right font-medium text-zinc-500 dark:text-zinc-400">Land</th>
                      <th className="py-2 text-right font-medium text-zinc-500 dark:text-zinc-400">Improvements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxAssessments.map((assessment) => (
                      <tr key={assessment.year} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                        <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">{assessment.year}</td>
                        <td className="py-3 text-right text-zinc-900 dark:text-zinc-100">
                          ${assessment.value?.toLocaleString() ?? "N/A"}
                        </td>
                        <td className="py-3 text-right text-zinc-600 dark:text-zinc-400">
                          ${assessment.land?.toLocaleString() ?? "N/A"}
                        </td>
                        <td className="py-3 text-right text-zinc-600 dark:text-zinc-400">
                          ${assessment.improvements?.toLocaleString() ?? "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Property Taxes */}
          {propertyTaxes.length > 0 && (
            <Section title="Property Taxes">
              <div className="space-y-3">
                {propertyTaxes.map((tax) => (
                  <div
                    key={tax.year}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50"
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{tax.year}</span>
                    <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      ${tax.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Location Details */}
          <Section title="Location Details">
            <div className="space-y-1">
              <InfoRow label="Full Address" value={property.formattedAddress} />
              <InfoRow label="County" value={property.county} />
              <InfoRow label="State FIPS" value={property.stateFips} />
              <InfoRow label="County FIPS" value={property.countyFips} />
              <InfoRow label="Latitude" value={property.latitude} />
              <InfoRow label="Longitude" value={property.longitude} />
            </div>
          </Section>

          {/* Legal Information */}
          <Section title="Legal Information">
            <div className="space-y-1">
              <InfoRow label="Assessor ID" value={property.assessorID} />
              <InfoRow label="Subdivision" value={property.subdivision} />
              <div className="pt-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Legal Description</p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{property.legalDescription}</p>
              </div>
            </div>
          </Section>

          {/* QR Code */}
          {property.assessorID && (
            <Section title="Property QR Code">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={`${API_BASE_URL}/api/barcodes/home/${encodeURIComponent(property.assessorID)}`}
                  alt="Property QR Code"
                  className="h-40 w-40 rounded-lg border border-zinc-200 dark:border-zinc-700"
                />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Scan to access property information
                </p>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PropertyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
            <span className="text-zinc-600 dark:text-zinc-400">Loading property details...</span>
          </div>
        </div>
      }
    >
      <PropertyContent />
    </Suspense>
  );
}
