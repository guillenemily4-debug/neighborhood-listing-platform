"use client";

import { PropertyCard } from "../components/PropertyCard";
import { SponsorBanner } from "../components/SponsorBanner";
import { SearchFilters } from "../components/SearchFilters";
import { Sponsor } from "../types";
import { validatedProperties } from "../lib/validatedProperties";


const SAMPLE_SPONSOR: Sponsor = {
  id: "spon-1",
  name: "Apex Home Loans",
  headline: "Get pre-approved in as little as 15 minutes with Apex.",
  targetUrl: "https://example.com/apex-loans",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold text-white">
        Featured Homes
      </h1>

      <SearchFilters onFilter={() => {}} />

      <div className="mb-8">
        <SponsorBanner sponsor={SAMPLE_SPONSOR} />
      </div>

      <section
        aria-label="Available Properties"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {validatedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </section>
    </main>
  );
}