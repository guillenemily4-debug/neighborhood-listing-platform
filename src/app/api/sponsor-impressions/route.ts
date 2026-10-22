
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { fetchEligibleSponsors } from "@/lib/sponsor-query";
import { selectSponsor } from "@/lib/sponsor-selector";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sponsorId = body?.sponsorId;
    const propertyId = body?.propertyId;

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (
      typeof sponsorId !== "string" ||
      typeof propertyId !== "string" ||
      !uuidPattern.test(sponsorId) ||
      !uuidPattern.test(propertyId)
    ) {
      return NextResponse.json(
        { error: "Invalid impression" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: property, error } = await supabase
      .from("properties")
      .select("id, zip_code")
      .eq("id", propertyId)
      .eq("is_approved", true)
      .maybeSingle();

    if (error || !property) {
      return NextResponse.json(
        { error: "Property unavailable" },
        { status: 404 }
      );
    }

    const context = {
      propertyId: property.id,
      zipCode: property.zip_code,
      nearbyZipCodes: [],
      placement: "property-sidebar",
      today: new Date().toISOString().slice(0, 10),
    };

    const candidates = await fetchEligibleSponsors(
      supabase,
      context
    );

    const selected = selectSponsor(context, candidates);

    // Only record the sponsor selected for this property.
    if (!selected || selected.id !== sponsorId) {
      return NextResponse.json(
        { error: "Sponsor not eligible" },
        { status: 400 }
      );
    }

    const impression = {
      sponsor_id: selected.id,
      placement: context.placement,
      timestamp: new Date().toISOString(),
      page_context: "property-listing",
    };

    // Class demonstration: log only coarse event data.
    // Never log visitor IP, cookies, or user identity.
    console.info("Sponsor impression:", impression);

    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to record impression" },
      { status: 500 }
    );
  }
}
