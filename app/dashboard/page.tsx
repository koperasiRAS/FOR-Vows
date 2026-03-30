"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package, ShoppingBag, RefreshCw, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { StatusBadge, needsPayment } from "@/components/shared/StatusBadge";
import type { OrderRow } from "@/types";
import { formatIDR } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/SectionHeading";

interface TrackedOrder {
  orderCode: string;
  order: OrderRow | null;
  loading: boolean;
  error: boolean;
}

const LOCAL_STORAGE_KEY = "forvows_recent_orders";

export default function DashboardPage() {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]") as string[];
      if (stored.length === 0) {
        setOrders([]);
        return;
      }
      // Initialize with loading state for each order
      setOrders(stored.map((code) => ({ orderCode: code, order: null, loading: true, error: false })));

      // Fetch all orders in parallel
      stored.forEach((code) => {
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
    } catch {
      setOrders([]);
    }
  }, []);

  const removeOrder = (code: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]") as string[];
      const updated = stored.filter((c) => c !== code);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setOrders((prev) => prev.filter((o) => o.orderCode !== code));
    } catch {
      // ignore
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={24} className="text-[#c9a96e] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <SectionHeading
            overline={lang === "id" ? "Pesanan Saya" : "My Orders"}
            title={lang === "id" ? "Lacak Pesanan Anda" : "Track Your Orders"}
            subtitle={
              lang === "id"
                ? "Semua pesanan yang pernah Anda buat akan muncul di sini."
                : "All orders you've placed will appear here."
            }
          />
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-20 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <ShoppingBag size={24} className="text-[#6a6a6a]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl text-[#faf8f5] mb-2">
                {lang === "id" ? "Belum Ada Pesanan" : "No Orders Yet"}
              </h2>
              <p className="text-sm text-[#6a6a6a] max-w-sm mx-auto">
                {lang === "id"
                  ? "Pilih template dan paket favorit Anda untuk membuat pesanan pertama."
                  : "Choose your favourite template and package to place your first order."}
              </p>
            </div>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
            >
              {lang === "id" ? "Lihat Template" : "Browse Templates"}
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Order List */}
        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map(({ orderCode, order, loading, error }) => (
              <div
                key={orderCode}
                className="border border-white/8 bg-[#0f0f0f] overflow-hidden"
              >
                {loading && (
                  <div className="flex items-center justify-center py-10 gap-3">
                    <Loader2 size={16} className="text-[#c9a96e] animate-spin" />
                    <span className="text-xs text-[#6a6a6a]">
                      {lang === "id" ? "Memuat..." : "Loading..."}
                    </span>
                  </div>
                )}

                {error && !loading && (
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-mono text-sm text-[#c9a96e]">{orderCode}</p>
                      <p className="text-xs text-red-400 mt-0.5">
                        {lang === "id" ? "Pesanan tidak ditemukan" : "Order not found"}
                      </p>
                    </div>
                    <button
                      onClick={() => removeOrder(orderCode)}
                      className="text-xs text-[#6a6a6a] hover:text-red-400 transition-colors"
                    >
                      {lang === "id" ? "Hapus" : "Remove"}
                    </button>
                  </div>
                )}

                {!loading && !error && order && (
                  <OrderCard order={order} lang={lang} onRemove={() => removeOrder(orderCode)} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {orders.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-xs text-[#6a6a6a] hover:text-[#c9a96e] transition-colors tracking-wide"
            >
              <ArrowRight size={12} className="rotate-180" />
              {lang === "id" ? "Buat pesanan baru" : "Place a new order"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Order Card ──────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  lang,
  onRemove,
}: {
  order: OrderRow;
  lang: "id" | "en";
  onRemove: () => void;
}) {
  const createdDate = new Date(order.created_at);
  const formattedDate = createdDate.toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        {/* Left info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-mono text-sm text-[#c9a96e]">{order.order_code}</p>
            <StatusBadge status={order.status} lang={lang} size="sm" />
          </div>
          <p className="text-[#faf8f5] text-sm mt-1">
            {order.groom_name} & {order.bride_name}
          </p>
          {order.package_name && (
            <div className="flex items-center gap-1.5 mt-1">
              <Package size={11} className="text-[#6a6a6a]" />
              <span className="text-xs text-[#8a8a8a]">{order.package_name}</span>
            </div>
          )}
          <p className="text-[10px] text-[#6a6a6a] mt-1">{formattedDate}</p>
        </div>

        {/* Right: price + action */}
        <div className="text-right shrink-0 flex flex-col items-end gap-2">
          {order.final_total != null && (
            <p className="font-serif text-base text-[#faf8f5]">
              {formatIDR(order.final_total)}
            </p>
          )}
          <Link
            href={`/orders/${encodeURIComponent(order.order_code)}`}
            className="flex items-center gap-1.5 text-[11px] text-[#c9a96e] hover:text-[#d4b87a] transition-colors tracking-wide"
          >
            {lang === "id" ? "Lihat Detail" : "View Details"}
            <ArrowRight size={11} />
          </Link>
          <button
            onClick={onRemove}
            className="text-[10px] text-[#6a6a6a] hover:text-red-400 transition-colors"
          >
            {lang === "id" ? "Sembunyikan" : "Hide"}
          </button>
        </div>
      </div>

      {/* Payment CTA for pending/waiting_payment */}
      {needsPayment(order.status) && order.final_total != null && (
        <div className="mt-4 pt-4 border-t border-white/6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#8a8a8a]">
              {lang === "id" ? "Total yang harus dibayar:" : "Amount due:"}
            </p>
            <p className="font-serif text-lg text-[#faf8f5]">{formatIDR(order.final_total)}</p>
          </div>
          <Link
            href={`/orders/${encodeURIComponent(order.order_code)}`}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#c9a96e] text-[#0a0a0a] text-[11px] tracking-widest uppercase font-medium hover:bg-[#d4b87a] transition-colors"
          >
            {lang === "id" ? "Bayar Sekarang" : "Pay Now"}
            <ArrowRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
