
"use client";

type Service = {
  id: string;
  title: string;
  hourly_rate: number;
  duration_minutes: number;
  coverage_radius_miles: number;
};

type ServiceCardProps = {
  service: Service;
  onBook: (serviceId: string) => void;
};

export default function ServiceCard({
  service,
  onBook,
}: ServiceCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {service.title}
        </h2>
      </header>

      <ul className="mb-5 space-y-2 text-gray-700">
        <li>
          <strong>Hourly rate:</strong> ${service.hourly_rate}/hr
        </li>
        <li>
          <strong>Duration:</strong> {service.duration_minutes} minutes
        </li>
        <li>
          <strong>Coverage radius:</strong>{" "}
          {service.coverage_radius_miles} miles
        </li>
      </ul>

      <button
        type="button"
        onClick={() => onBook(service.id)}
        aria-label={`Book appointment for ${service.title}`}
        className="rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        Book Now
      </button>
    </article>
  );
}
