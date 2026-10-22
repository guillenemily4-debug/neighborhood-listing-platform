
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { fetchEligibleSponsors } from "@/lib/sponsor-query";
import { selectSponsor } from "@/lib/sponsor-selector";

export async function GET(request: NextRequest) {
  try {
    const propertyId =
      request.nextUrl.searchParams.get("propertyId");

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!propertyId || !uuidPattern.test(propertyId)) {
      return NextResponse.json(
        { error: "Invalid property ID" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: property, error: propertyError } =
      await supabase
        .from("properties")
        .select("id, zip_code")
        .eq("id", propertyId)
        .eq("is_approved", true)
        .maybeSingle();

    if (propertyError) {
      throw new Error("Property lookup failed");
    }

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
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

    if (!selected) {
      return NextResponse.json({ sponsor: null });
    }

    const { data: sponsor, error: sponsorError } =
      await supabase
        .from("sponsors")
        .select("id, name, description")
        .eq("id", selected.id)
        .eq("is_approved", true)
        .eq("is_active", true)
        .maybeSingle();

    if (sponsorError) {
      throw new Error("Sponsor lookup failed");
    }

    return NextResponse.json({
      sponsor: sponsor ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load sponsor" },
      { status: 500 }
    );
  }
}
