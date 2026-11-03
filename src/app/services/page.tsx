
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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
  const [selected, setSelected] = useState<Service | null>(null);
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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
    const service = services.find((item) => item.id === serviceId);

    if (service) {
      setSelected(service);
      setMessage("");
    }
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected || submitting) return;

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: selected.id,
          client_email: email,
          requested_date: date,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to submit booking");
      }

      setSelected(null);
      setEmail("");
      setDate("");
      setNotes("");
      setMessage("Booking request submitted successfully!");
    } catch {
      setMessage("Unable to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-white">
        Local Neighborhood Services
      </h1>

      <p className="mb-8 text-gray-300">
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

      {message && (
        <p role="status" className="mt-6 text-white">
          {message}
        </p>
      )}

      {selected && (
        <section
          aria-labelledby="booking-heading"
          className="mt-8 rounded-lg bg-white p-6 text-gray-900"
        >
          <h2
            id="booking-heading"
            className="mb-4 text-2xl font-bold"
          >
            Book {selected.title}
          </h2>

          <form onSubmit={submitBooking} className="space-y-4">
            <div>
              <label htmlFor="booking-email" className="block font-medium">
                Email Address
              </label>
              <input
                id="booking-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded border p-2 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label htmlFor="booking-date" className="block font-medium">
                Requested Appointment Date
              </label>
              <input
                id="booking-date"
                type="date"
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded border p-2 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label htmlFor="booking-notes" className="block font-medium">
                Booking Notes
              </label>
              <textarea
                id="booking-notes"
                required
                minLength={10}
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full rounded border p-2 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                placeholder="Describe the service you need"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Booking"}
              </button>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded border px-4 py-2 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
