
"use client";

import { useEffect, useRef, useState } from "react";
import SponsorPlacement from "./SponsorPlacement";

type Sponsor = {
  id: string;
  name: string;
  description: string | null;
};

export default function PropertySponsor({
  propertyId,
}: {
  propertyId: string;
}) {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const placementRef = useRef<HTMLDivElement>(null);
  const recordedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const controller = new AbortController();

    async function loadSponsor() {
      setLoading(true);
      setError(false);
      setSponsor(null);

      try {
        const response = await fetch(
          `/api/sponsors?propertyId=${encodeURIComponent(propertyId)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load sponsor");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setSponsor(data.sponsor ?? null);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSponsor();

    return () => controller.abort();
  }, [propertyId]);

  useEffect(() => {
    if (!sponsor || !placementRef.current) return;

    const sponsorId = sponsor.id;
    const key = `${propertyId}:${sponsorId}`;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !entries[0]?.isIntersecting ||
          entries[0].intersectionRatio < 0.5 ||
          recordedRef.current.has(key)
        ) {
          return;
        }

        recordedRef.current.add(key);
        observer.disconnect();

        void fetch("/api/sponsor-impressions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sponsorId,
            propertyId,
          }),
        }).catch(() => {
          // Impression reporting must not break the page.
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(placementRef.current);

    return () => observer.disconnect();
  }, [sponsor, propertyId]);

  if (loading) {
    return (
      <p className="mt-4 text-sm text-gray-500">
        Loading community sponsors...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-4 text-sm text-gray-500">
        Sponsor information is unavailable.
      </p>
    );
  }

  return (
    <div className="mt-4" ref={placementRef}>
      <SponsorPlacement sponsor={sponsor} />
    </div>
  );
}
