
"use client";

import { useEffect, useState } from "react";
import ServiceGrid from "@/components/ServiceGrid";

type Service = {
  id: string;
  title: string;
  hourly_rate: number;
  duration_minutes: number;
  coverage_radius_miles: number;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch("/api/services");

        if (!response.ok) {
          throw new Error("Unable to load services");
        }

        const data = await response.json();
        setServices(data.services ?? []);
      } catch {
        setError("Unable to load services right now.");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  function handleBooking(serviceId: string) {
    alert(`Booking requested for service: ${serviceId}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Local Neighborhood Services
      </h1>

      <p className="mb-8 text-gray-700">
        Explore approved services available in your neighborhood.
      </p>

      {loading && <p role="status">Loading services...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && services.length === 0 && (
        <p>No approved services are available yet.</p>
      )}

      {!loading && !error && services.length > 0 && (
        <ServiceGrid
          services={services}
          onBook={handleBooking}
        />
      )}
    </main>
  );
}
