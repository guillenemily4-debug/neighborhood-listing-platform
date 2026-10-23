
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (
    !secret ||
    request.headers.get("authorization") !== `Bearer ${secret}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("properties")
      .select("id", { head: true, count: "exact" })
      .limit(1);

    if (error) {
      console.error("Database check failed:", error.message);
      return NextResponse.json(
        { error: "Database check failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "healthy" });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
