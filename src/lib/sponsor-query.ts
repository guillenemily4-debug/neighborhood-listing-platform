
import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  SponsorCandidate,
  SponsorContext,
} from "./sponsor-selector";

export async function fetchEligibleSponsors(
  supabase: SupabaseClient,
  context: SponsorContext
): Promise<SponsorCandidate[]> {
  if (!/^\d{5}$/.test(context.zipCode)) {
    return [];
  }

  // ZIP codes must come from approved geographic data.
  const zipCodes = [
    ...new Set([
      context.zipCode,
      ...context.nearbyZipCodes,
    ]),
  ].filter((zip) => /^\d{5}$/.test(zip));

  const { data, error } = await supabase
    .from("sponsors")
    .select(
      "id,is_approved,is_active,placement,start_date,end_date,target_zip_codes,priority"
    )
    .eq("is_approved", true)
    .eq("is_active", true)
    .eq("placement", context.placement)
    .lte("start_date", context.today)
    .gte("end_date", context.today)
    .overlaps("target_zip_codes", zipCodes);

  if (error) {
    throw new Error("Unable to load sponsor candidates");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    isApproved: row.is_approved,
    isActive: row.is_active,
    placement: row.placement,
    startDate: row.start_date,
    endDate: row.end_date,
    targetZipCodes: row.target_zip_codes,
    priority: row.priority,
  }));
}
