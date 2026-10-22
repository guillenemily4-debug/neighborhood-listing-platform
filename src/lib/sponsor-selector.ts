
export type SponsorCandidate = {
  id: string;
  isApproved: boolean;
  isActive: boolean;
  placement: string;
  startDate: string;
  endDate: string;
  targetZipCodes: string[];
  priority: number;
};

export type SponsorContext = {
  propertyId: string;
  zipCode: string;
  nearbyZipCodes: string[];
  placement: string;
  today: string;
};

// Stable hash for repeatable sponsor rotation.
function stableHash(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}

export function selectSponsor(
  context: SponsorContext,
  candidates: SponsorCandidate[]
): SponsorCandidate | null {
  if (!/^\d{5}$/.test(context.zipCode)) {
    return null;
  }

  const eligible = candidates.filter((sponsor) => {
    const matchesZip =
      sponsor.targetZipCodes.includes(context.zipCode) ||
      sponsor.targetZipCodes.some((zip) =>
        context.nearbyZipCodes.includes(zip)
      );

    return (
      sponsor.isApproved &&
      sponsor.isActive &&
      sponsor.placement === context.placement &&
      sponsor.startDate <= context.today &&
      sponsor.endDate >= context.today &&
      matchesZip
    );
  });

  // No eligible sponsor: let the UI show a house message.
  if (eligible.length === 0) {
    return null;
  }

  // Higher priority wins first.
  const highestPriority = Math.max(
    ...eligible.map((sponsor) => sponsor.priority)
  );

  const highest = eligible.filter(
    (sponsor) => sponsor.priority === highestPriority
  );

  // Prefer an exact ZIP match among equally ranked sponsors.
  const exact = highest.filter((sponsor) =>
    sponsor.targetZipCodes.includes(context.zipCode)
  );

  const pool = exact.length > 0 ? exact : highest;

  // Stable rotation, independent of database result order.
  const sorted = [...pool].sort((a, b) =>
    a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  );

  const index = stableHash(context.propertyId) % sorted.length;

  return sorted[index];
}
