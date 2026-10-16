
"use client";

import { useEffect, useState } from "react";

type Property = {
  id: string;
  title: string;
  description: string | null;
  city: string;
  state: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
};

export default function Home() {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
        const response = await fetch("/api/listings");

        if (!response.ok) {
          throw new Error("Unable to load listings");
        }

        const data = await response.json();
        setListings(data.listings ?? []);
      } catch {
        setError("Unable to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">
          Neighborhood Listing Platform
        </h1>

        <p className="mt-4 text-lg">
          A community platform that helps neighbors discover local listings,
          neighborhood sponsors, and accessible voice assistance.
        </p>

        <section
          className="mt-10 grid gap-6 md:grid-cols-3"
          aria-label="Platform features"
        >
          <article className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">Listings</h2>
            <p className="mt-2">
              Browse useful property and neighborhood listings in one place.
            </p>
          </article>

          <article className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">
              Neighborhood Sponsors
            </h2>
            <p className="mt-2">
              Discover local businesses and organizations that support the
              community.
            </p>
          </article>

          <article className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">Voice Help</h2>
            <p className="mt-2">
              Access voice-based assistance to help navigate the platform.
            </p>
          </article>
        </section>

        <section className="mt-12" aria-labelledby="property-heading">
          <h2
            id="property-heading"
            className="text-3xl font-bold"
          >
            Available Properties
          </h2>

          {loading && (
            <p role="status" className="mt-6">
              Loading properties...
            </p>
          )}

          {!loading && error && (
            <p role="alert" className="mt-6 text-red-700">
              {error}
            </p>
          )}

          {!loading && !error && listings.length === 0 && (
            <p className="mt-6">
              No properties are currently available.
            </p>
          )}

          {!loading && !error && listings.length > 0 && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {listings.map((property) => (
                <article
                  key={property.id}
                  className="rounded-lg bg-white p-6 shadow"
                >
                  <h3 className="text-xl font-semibold">
                    {property.title}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {property.city}, {property.state}
                  </p>

                  <p className="mt-3 text-lg font-bold">
                    ${Number(property.price).toLocaleString("en-US")}
                  </p>

                  <p className="mt-2">
                    {property.bedrooms ?? "N/A"} bedrooms ·{" "}
                    {property.bathrooms ?? "N/A"} bathrooms
                  </p>

                  {property.description && (
                    <p className="mt-3 text-gray-600">
                      {property.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
