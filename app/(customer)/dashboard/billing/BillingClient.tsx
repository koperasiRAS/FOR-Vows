"use client";

import { Suspense, useEffect, useState } from "react";
import { Loader2, CreditCard, CheckCircle, Clock } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { createClient } from "@/lib/supabase/client";
import { formatIDR } from "@/lib/utils";
import type { OrderRow } from "@/types";

interface TrackedOrder {
  orderCode: string;
  order: OrderRow | null;
  loading: boolean;
  error: boolean;
}

const LOCAL_STORAGE_KEY = "forvows_recent_orders";

export function BillingClient() {
  const { lang } = useLanguage();
  const [orders, setOrders] = useState<TrackedOrder[]>([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const seenCodes = new Set<string>();
      const initialOrders: TrackedOrder[] = [];

      if (user) {
        const { data: userOrders } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (userOrders && userOrders.length > 0) {
          userOrders.forEach((order: OrderRow) => {
            seenCodes.add(order.order_code);
            initialOrders.push({ orderCode: order.order_code, order, loading: false, error: false });
          });
        }
      }

      try {
        const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]") as string[];
        const localCodes = stored.filter((code) => !seenCodes.has(code));
        if (localCodes.length > 0) {
          setOrders([...initialOrders, ...localCodes.map((code) => ({
            orderCode: code, order: null, loading: true, error: false,
          }))]);
          localCodes.forEach((code) => {
            fetch(`/api/orders?orderCode=${encodeURIComponent(code)}`)
              .then((r) => r.json())
              .then((data) => {
                if (data.success && data.order) {
                  setOrders((prev) =>
                    prev.map((o) => (o.orderCode === code ? { ...o, order: data.order, loading: false } : o))
                  );
                } else {
                  setOrders((prev) =>
                    prev.map((o) => (o.orderCode === code ? { ...o, loading: false, error: true } : o))
                  );
                }
              })
              .catch(() => {
                setOrders((prev) =>
                  prev.map((o) => (o.orderCode === code ? { ...o, loading: false, error: true } : o))
                );
              });
          });
        } else {
          setOrders(initialOrders);
        }
      } catch {
        setOrders(initialOrders);
      }
    };

    fetchAllOrders();
  }, []);

  const paidOrders = orders.filter(
    (o) => o.order && ["paid", "processing", "completed"].includes(o.order!.status)
  );

  const totalSpent = paidOrders.reduce(
    (sum, o) => sum + (o.order?.final_total ?? o.order?.total_price ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="customer" />

      <main className="ml-64 min-h-screen bg-white">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-12 py-8 border-b border-outline-variant/10">
          <h2 className="font-headline text-3xl italic text-on-surface tracking-tight">
            {lang === "id" ? "Riwayat Pembayaran" : "Billing History"}
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            {lang === "id"
              ? "Semua transaksi dan invoice pesanan Anda."
              : "All transactions and invoices for your orders."}
          </p>
        </header>

        <section className="px-12 pb-24">
          {paidOrders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-10 max-w-lg">
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard size={16} strokeWidth={1.5} className="text-stitch-primary" />
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-label">
                    {lang === "id" ? "Total Belanja" : "Total Spent"}
                  </span>
                </div>
                <p className="font-headline text-2xl text-on-surface">
                  {totalSpent > 0 ? formatIDR(totalSpent) : "—"}
                </p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle size={16} strokeWidth={1.5} className="text-stitch-primary" />
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-label">
                    {lang === "id" ? "Pesanan Dibayar" : "Paid Orders"}
                  </span>
                </div>
                <p className="font-headline text-2xl text-on-surface">{paidOrders.length}</p>
              </div>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <CreditCard size={40} strokeWidth={1} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">
                {lang === "id"
                  ? "Belum ada riwayat pembayaran."
                  : "No billing history yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {orders.map(({ orderCode, order, loading }) => {
                if (loading) {
                  return (
                    <div key={orderCode} className="flex items-center justify-center py-8 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                      <Loader2 size={18} className="text-stitch-primary animate-spin" />
                    </div>
                  );
                }
                if (!order) return null;

                const isPaid = ["paid", "processing", "completed"].includes(order.status);
                const createdDate = new Date(order.created_at).toLocaleDateString(
                  lang === "id" ? "id-ID" : "en-GB",
                  { day: "numeric", month: "long", year: "numeric" }
                );

                return (
                  <div
                    key={orderCode}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden shadow-[0_10px_20px_rgba(43,43,43,0.03)]"
                  >
                    <div className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isPaid ? "bg-green-100" : "bg-amber-100"
                        }`}>
                          {isPaid ? (
                            <CheckCircle size={15} strokeWidth={1.5} className="text-green-600" />
                          ) : (
                            <Clock size={15} strokeWidth={1.5} className="text-amber-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-stitch-primary">{order.order_code}</p>
                          <p className="text-xs text-stone-400">{createdDate}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {(order.final_total ?? order.total_price) != null ? (
                          <p className="font-headline text-base text-on-surface">
                            {formatIDR(order.final_total ?? order.total_price ?? 0)}
                          </p>
                        ) : (
                          <p className="text-xs text-stone-400">—</p>
                        )}
                        <span className={`text-[10px] font-semibold uppercase tracking-widest ${
                          isPaid ? "text-green-600" : "text-amber-600"
                        }`}>
                          {isPaid
                            ? lang === "id" ? "Lunas" : "Paid"
                            : lang === "id" ? "Belum Bayar" : "Pending"}
                        </span>
                      </div>
                    </div>
                    {order.package_name && (
                      <div className="px-6 py-3 bg-surface-container-low/30 border-t border-outline-variant/10">
                        <p className="text-xs text-stone-400">
                          <span className="font-label uppercase tracking-widest">{lang === "id" ? "Paket" : "Package"}: </span>
                          <span className="font-serif italic text-on-surface">{order.package_name}</span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
