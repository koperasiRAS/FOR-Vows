import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServiceClient();

    // Fetch all authenticated users
    // Note: requires Supabase service role — this works in server context
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      // Fallback: just return empty list if admin API not accessible
      return NextResponse.json({ customers: [], error: usersError.message });
    }

    // Get all orders grouped by user
    const { data: orders } = await supabase
      .from("orders")
      .select("user_id, order_code, groom_name, bride_name, phone, status, final_total, created_at, user_id")
      .order("created_at", { ascending: false });

    const orderMap: Record<string, { count: number; total: number; last_date: string | null }> = {};
    for (const o of orders ?? []) {
      if (!o.user_id) continue;
      if (!orderMap[o.user_id]) {
        orderMap[o.user_id] = { count: 0, total: 0, last_date: null };
      }
      orderMap[o.user_id].count++;
      orderMap[o.user_id].total += o.final_total ?? 0;
      const d = new Date(o.created_at);
      if (!orderMap[o.user_id].last_date || d > new Date(orderMap[o.user_id].last_date!)) {
        orderMap[o.user_id].last_date = o.created_at;
      }
    }

    const customers = (users.users ?? [])
      .filter(u => !u.email?.includes("supabase"))
      .map(u => ({
        user_id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? u.email?.split("@")[0] ?? "—",
        phone: u.user_metadata?.phone ?? null,
        order_count: orderMap[u.id]?.count ?? 0,
        total_spent: orderMap[u.id]?.total ?? 0,
        last_order_date: orderMap[u.id]?.last_date ?? null,
      }))
      .filter(c => c.order_count > 0);

    return NextResponse.json({ customers });
  } catch (err) {
    console.error("Customers API error:", err);
    return NextResponse.json({ error: "Internal server error", customers: [] }, { status: 500 });
  }
}
