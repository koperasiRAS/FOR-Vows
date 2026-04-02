import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// GET /api/settings — load settings dari Supabase
export async function GET() {
  try {
    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from("settings")
      .select("wa_number, email, instagram, maintenance_mode, prices")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings: data ?? null });
  } catch (err) {
    console.error("[GET /api/settings]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/settings — simpan settings ke Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wa_number, email, instagram, maintenance_mode, prices } = body;

    const supabase = await createServiceClient();

    const { error } = await supabase
      .from("settings")
      .upsert(
        {
          id: 1,
          wa_number: wa_number ?? "",
          email: email ?? "",
          instagram: instagram ?? "",
          maintenance_mode: maintenance_mode ?? false,
          prices: prices ?? { basic: "299000", premium: "599000", exclusive: "999000" },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/settings]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
