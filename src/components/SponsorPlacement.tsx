
type SponsorDisplay = {
  id: string;
  name: string;
  description?: string | null;
};

type SponsorPlacementProps = {
  sponsor: SponsorDisplay | null;
};

export default function SponsorPlacement({
  sponsor,
}: SponsorPlacementProps) {
  if (!sponsor) {
    return (
      <aside
        aria-label="Community information"
        className="rounded-lg border p-4"
      >
        <h3 className="font-semibold">
          Local Community Spotlight
        </h3>
        <p className="text-sm">
          Discover local businesses and services
          in your community.
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Sponsored local business"
      className="rounded-lg border p-4"
    >
      <span className="mb-2 inline-block rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-800">
        Sponsored
      </span>

      <h3 className="font-semibold">
        {sponsor.name}
      </h3>

      {sponsor.description && (
        <p className="mt-2 text-sm">
          {sponsor.description}
        </p>
      )}

      <a
        href={`/api/sponsors/${encodeURIComponent(sponsor.id)}/click`}
        target="_blank"
        rel="noopener noreferrer sponsored nofollow"
        className="mt-3 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Visit Sponsor
      </a>
    </aside>
  );
}
