import React from "react";
import { Sponsor } from "../types";

export const SponsorBanner: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => {
  return (
    <aside
      aria-label="Sponsored Content"
      className="flex flex-col justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm md:flex-row md:items-center"
    >
      <div>
        <span className="inline-block rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-900">
          Sponsored
        </span>

        <p className="mt-2 text-base font-bold text-slate-900">
          {sponsor.headline}
        </p>
      </div>

      <a
        href={sponsor.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit sponsor website for ${sponsor.name}, opens in a new tab`}
        className="mt-3 inline-block rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 md:mt-0"
      >
        Learn more about {sponsor.name}
      </a>
    </aside>
  );
};