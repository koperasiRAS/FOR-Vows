"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users as UsersIcon, ChevronRight, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

interface CustomerOrder {
  id: string;
  order_code: string;
  groom_name: string | null;
  bride_name: string | null;
  phone: string | null;
  status: string;
  final_total: number | null;
  created_at: string;
  user_id: string;
}

interface CustomerRow {
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  order_count: number;
  total_spent: number;
  last_order_date: string | null;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Record<string, CustomerOrder[]>>({});

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/admin/login"); return; }
      setUserEmail(data.user.email ?? "");
    });
  }, [router]);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers ?? []);
      } else {
        // Fallback: fetch orders directly and group by user_id
        const res2 = await fetch("/api/orders");
        if (res2.ok) {
          const data = await res2.json();
          const orders: CustomerOrder[] = data.orders ?? [];
          const grouped: Record<string, CustomerRow> = {};
          for (const o of orders) {
            if (!o.user_id) continue;
            if (!grouped[o.user_id]) {
              grouped[o.user_id] = {
                user_id: o.user_id,
                email: "",
                full_name: `${o.groom_name ?? ""} & ${o.bride_name ?? ""}`.trim(),
                phone: o.phone,
                order_count: 0,
                total_spent: 0,
                last_order_date: null,
              };
            }
            grouped[o.user_id].order_count++;
            grouped[o.user_id].total_spent += o.final_total ?? 0;
            const d = new Date(o.created_at);
            if (!grouped[o.user_id].last_order_date || d > new Date(grouped[o.user_id].last_order_date!)) {
              grouped[o.user_id].last_order_date = o.created_at;
            }
          }
          setCustomers(Object.values(grouped));
        }
      }
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const fetchCustomerOrders = async (userId: string) => {
    if (customerOrders[userId]) return;
    const res = await fetch("/api/orders");
    if (res.ok) {
      const data = await res.json();
      const filtered = (data.orders ?? []).filter((o: CustomerOrder) => o.user_id === userId);
      setCustomerOrders(prev => ({ ...prev, [userId]: filtered }));
    }
  };

  const filtered = customers.filter(c =>
    !search ||
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? "").includes(search)
  );

  const formatDate = (d: string | null) => d
    ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d))
    : "—";

  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="admin" />
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-12 py-8 flex justify-between items-center border-b border-outline-variant/10">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-stitch-primary">Customers</h2>
            <p className="text-sm text-stone-500 mt-1 font-light">
              {customers.length} customer{customers.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" strokeWidth={1.5} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="pl-11 pr-5 py-3 bg-surface-container-low rounded-xl w-72 text-sm border-none focus:ring-1 focus:ring-stitch-primary-container transition-all placeholder:text-stone-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500">{userEmail}</span>
            </div>
          </div>
        </header>

        <section className="px-12 pb-24">
          <div className="mt-8 bg-surface-container-lowest rounded-[1rem] overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)] border border-outline-variant/10">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-stitch-primary-container/30 border-t-stitch-primary rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <UsersIcon size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Belum ada customer.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    {["Customer", "WhatsApp", "Total Pesanan", "Total Belanja", "Last Order", ""].map(h => (
                      <th key={h} className="px-8 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary border-none">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filtered.map(c => (
                    <>
                      <tr key={c.user_id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{c.full_name || "—"}</p>
                            <p className="text-[11px] text-stone-400">{c.email || "No email"}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-stitch-secondary">{c.phone ?? "—"}</td>
                        <td className="px-8 py-6 text-sm font-semibold text-stitch-primary">{c.order_count}</td>
                        <td className="px-8 py-6 text-sm text-stitch-secondary">{formatIDR(c.total_spent)}</td>
                        <td className="px-8 py-6 text-sm text-stitch-secondary">{formatDate(c.last_order_date)}</td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => {
                              if (expandedId === c.user_id) { setExpandedId(null); return; }
                              setExpandedId(c.user_id);
                              fetchCustomerOrders(c.user_id);
                            }}
                            className="flex items-center gap-1 text-xs text-stitch-primary hover:underline ml-auto"
                          >
                            <Eye size={14} />
                            Detail
                            <ChevronRight size={14} className={`transition-transform ${expandedId === c.user_id ? "rotate-90" : ""}`} />
                          </button>
                        </td>
                      </tr>
                      {expandedId === c.user_id && (
                        <tr key={`${c.user_id}-orders`}>
                          <td colSpan={6} className="px-8 py-4 bg-surface-container-low/50">
                            <p className="text-[10px] uppercase tracking-widest text-stitch-secondary font-label mb-3">Order History</p>
                            {(customerOrders[c.user_id] ?? []).length === 0
                              ? <p className="text-xs text-stone-400">Memuat...</p>
                              : (
                                <table className="w-full text-left">
                                  <thead>
                                    <tr className="border-b border-outline-variant/10">
                                      {["Order Code", "Couple", "Status", "Total", "Date"].map(h => (
                                        <th key={h} className="pb-2 text-[10px] uppercase tracking-widest text-stone-400 font-label">{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(customerOrders[c.user_id] ?? []).map(o => (
                                      <tr key={o.id} className="border-b border-outline-variant/5">
                                        <td className="py-2 pr-4 text-xs font-mono text-stitch-primary">{o.order_code}</td>
                                        <td className="py-2 pr-4 text-xs">{o.groom_name} & {o.bride_name}</td>
                                        <td className="py-2 pr-4 text-xs">
                                          <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase ${
                                            o.status === "completed" ? "bg-green-100 text-green-700" :
                                            o.status === "processing" ? "bg-blue-100 text-blue-700" :
                                            o.status === "pending_payment" ? "bg-yellow-100 text-yellow-700" :
                                            "bg-stone-100 text-stone-500"
                                          }`}>{o.status}</span>
                                        </td>
                                        <td className="py-2 pr-4 text-xs">{formatIDR(o.final_total ?? 0)}</td>
                                        <td className="py-2 text-xs text-stone-400">{formatDate(o.created_at)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
