import { createAuthenticatedClient } from "@/lib/supabase-auth";
import { listingSchema } from "@/lib/listing-schema";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("properties")
      .select(
        "id, title, description, address, city, state, zip_code, price, bedrooms, bathrooms, created_at"
      )
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error.message);

      return NextResponse.json(
        { error: "Unable to load listings" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { listings: data ?? [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Listings server error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createAuthenticatedClient();

    // Verify the signed-in user.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate the submitted data.
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const validation = listingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid listing information" },
        { status: 400 }
      );
    }

    // Ownership comes from the verified user,
    // never from the request body.
    const { error } = await supabase
      .from("properties")
      .insert({
        ...validation.data,
        owner_id: user.id,
      });

    if (error) {
      console.error("Listing creation failed:", error.code);

      return NextResponse.json(
        { error: "Unable to create listing" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Listing created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Listing route error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
