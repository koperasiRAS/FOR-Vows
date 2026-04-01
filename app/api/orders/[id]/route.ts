import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient, createServiceClient } from "@/lib/supabase/server";

// ── Auth guard: requires a valid Supabase session + admin role ─────────────────
async function requireAdminSession(request: NextRequest) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // C1: Admin role check (type-safe)
  const rawRoles = user.app_metadata?.roles;
  let roles: string[] = [];
  if (Array.isArray(rawRoles)) {
    roles = rawRoles.filter((r): r is string => typeof r === "string");
  } else if (typeof rawRoles === "string") {
    roles = [rawRoles];
  }
  if (!roles.includes("admin")) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  return user;
}

// ── GET: single order by numeric id (admin only) ─────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { readonly params: Promise<{ readonly id: string }> }
) {
  const authUser = await requireAdminSession(request);
  if (authUser instanceof NextResponse) return authUser;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: "Missing order id" }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, order: data });
}
