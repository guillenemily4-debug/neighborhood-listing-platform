"use client";

import { PropertyCard } from "../components/PropertyCard";
import { SponsorBanner } from "../components/SponsorBanner";
import { SearchFilters } from "../components/SearchFilters";
import { Property, Sponsor } from "../types";

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Highland Park Modern Craft",
    price: 649000,
    location: {
      address: "1402 Oak Ridge Ln",
      city: "Austin",
      state: "TX",
      zipCode: "78704",
    },
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    imageAlt:
      "Two-story modern home with gray exterior siding and front lawn",
  },
  {
    id: "prop-2",
    title: "Downtown Vista Condo",
    price: 420000,
    location: {
      address: "300 Colorado St #12B",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
    },
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    imageAlt:
      "Bright high-rise condo living room with floor-to-ceiling city views",
  },
  {
    id: "prop-3",
    title: "Sunny Slope Bungalow",
    price: 515000,
    location: {
      address: "812 W 34th St",
      city: "Austin",
      state: "TX",
      zipCode: "78705",
    },
    bedrooms: 2,
    bathrooms: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80",
    imageAlt:
      "Restored single-story brick craftsman bungalow with covered porch",
  },
];

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
        {SAMPLE_PROPERTIES.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </section>
    </main>
  );
}