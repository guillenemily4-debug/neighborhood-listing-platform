
import { NextResponse } from "next/server";
import { createAuthenticatedClient } from "@/lib/supabase-auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { serviceSchema } from "@/schemas/service";

// GET: Show only approved services.
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("services")
      .select(
        "id, title, hourly_rate, duration_minutes, coverage_radius_miles"
      )
      .eq("status", "approved");

    if (error) {
      console.error("Services GET failed:", error.code);

      return NextResponse.json(
        { error: "Unable to load services" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { services: data ?? [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Services GET error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// POST: Authenticated providers create draft services.
export async function POST(request: Request) {
  try {
    const supabase = await createAuthenticatedClient();

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

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const result = serviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Determine the user's role from the database.
    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 403 }
      );
    }

    if (
      profile.role !== "merchant" &&
      profile.role !== "provider"
    ) {
      return NextResponse.json(
        { error: "Provider access required" },
        { status: 403 }
      );
    }

    // Assign ownership using the authenticated session.
    const { data, error } = await supabase
      .from("services")
      .insert({
        ...result.data,
        provider_id: user.id,
        status: "draft",
      })
      .select(
        "id, provider_id, title, hourly_rate, duration_minutes, coverage_radius_miles, status"
      )
      .single();

    if (error) {
      console.error("Service creation failed:", error.code);

      return NextResponse.json(
        { error: "Unable to create service" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { service: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Services POST error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
