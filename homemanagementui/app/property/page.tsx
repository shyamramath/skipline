"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Property } from "../types/property";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get searched address from URL params
  const searchedAddress = {
    street: searchParams.get("street"),
    city: searchParams.get("city"),
    state: searchParams.get("state"),
    zipcode: searchParams.get("zipcode"),
  };
  const hasSearchedAddress = searchedAddress.street && searchedAddress.city;

  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await fetch(`${API_BASE_URL}/home/dummyproperty`);
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
  }, []);

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
          <p className="text-lg font-medium text-red-600 dark:text-red-400">Error: {error}</p>
          <Link href="/" className="mt-4 inline-block text-sm text-zinc-600 hover:underline dark:text-zinc-400">
            Go back home
          </Link>
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
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {property.propertyType && <Badge variant="info">{property.propertyType}</Badge>}
                {property.ownerOccupied && <Badge variant="success">Owner Occupied</Badge>}
                {hasSearchedAddress && <Badge variant="success">Searched</Badge>}
              </div>
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
                          ${assessment.value.toLocaleString()}
                        </td>
                        <td className="py-3 text-right text-zinc-600 dark:text-zinc-400">
                          ${assessment.land.toLocaleString()}
                        </td>
                        <td className="py-3 text-right text-zinc-600 dark:text-zinc-400">
                          ${assessment.improvements.toLocaleString()}
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
