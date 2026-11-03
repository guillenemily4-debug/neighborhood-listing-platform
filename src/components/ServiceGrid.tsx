
"use client";

import ServiceCard from "./ServiceCard";

type Service = {
  id: string;
  title: string;
  hourly_rate: number;
  duration_minutes: number;
  coverage_radius_miles: number;
};

type ServiceGridProps = {
  services: Service[];
  onBook: (serviceId: string) => void;
};

export default function ServiceGrid({
  services,
  onBook,
}: ServiceGridProps) {
  return (
    <section aria-label="Available local services">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onBook={onBook}
          />
        ))}
      </div>
    </section>
  );
}
