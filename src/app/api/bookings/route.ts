
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const bookingSchema = z.strictObject({
  service_id: z.uuid(),
  client_email: z.email(),
  requested_date: z.iso.date(),
  notes: z.string().trim().min(10),
});

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid booking information",
          details: z.flattenError(result.error),
        },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Check that the service is approved.
    const { data: service, error: lookupError } =
      await supabase
        .from("services")
        .select("id")
        .eq("id", result.data.service_id)
        .eq("status", "approved")
        .maybeSingle();

    if (lookupError) {
      return NextResponse.json(
        { error: "Unable to verify service" },
        { status: 500 }
      );
    }

    if (!service) {
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 404 }
      );
    }

    // Do not return private booking records.
    const { error } = await supabase
      .from("bookings")
      .insert(result.data);

    if (error) {
      console.error("Booking failed:", error.code);

      return NextResponse.json(
        { error: "Unable to create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Booking request submitted" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking API error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
