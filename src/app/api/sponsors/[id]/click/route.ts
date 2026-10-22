
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { validateSponsorUrl } from "@/lib/sponsor-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return new NextResponse("Invalid sponsor ID", {
      status: 400,
    });
  }

  try {
    const supabase = createServerSupabaseClient();
    const today = new Date().toISOString().slice(0, 10);

    const { data: sponsor, error } = await supabase
      .from("sponsors")
      .select("id, website_url")
      .eq("id", id)
      .eq("is_approved", true)
      .eq("is_active", true)
      .eq("placement", "property-sidebar")
      .lte("start_date", today)
      .gte("end_date", today)
      .maybeSingle();

    if (error) {
      return new NextResponse("Sponsor lookup failed", {
        status: 503,
      });
    }

    if (!sponsor) {
      return new NextResponse("Sponsor unavailable", {
        status: 404,
      });
    }

    const destination = validateSponsorUrl(
      sponsor.website_url
    );

    if (!destination) {
      return new NextResponse("Unsafe sponsor URL", {
        status: 400,
      });
    }

    const response = NextResponse.redirect(destination, 302);

    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");

    return response;
  } catch {
    return new NextResponse("Sponsor service unavailable", {
      status: 503,
    });
  }
}
