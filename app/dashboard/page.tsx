"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import type { OrderRow } from "@/types";

interface TrackedOrder {
  orderCode: string;
  order: OrderRow | null;
  loading: boolean;
  error: boolean;
}

const LOCAL_STORAGE_KEY = "forvows_recent_orders";

function getTemplateGradient(template: string | null | undefined): { from: string; to: string } {
  if (!template) return { from: "#735c00", to: "#d4af37" };
  // Use deterministic colors based on template name
  const colors: Array<{ from: string; to: string }> = [
    { from: "#2c1810", to: "#735c00" },
    { from: "#1a2e1a", to: "#4a7c59" },
    { from: "#1a1a2e", to: "#4a4a8c" },
    { from: "#2e1a1a", to: "#8c4a4a" },
    { from: "#1a2e2e", to: "#4a7c7c" },
    { from: "#2e2e1a", to: "#7c734a" },
  ];
  const idx = template.charCodeAt(0) % colors.length;
  return colors[idx];
}

function EmptyState({ lang }: { readonly lang: "id" | "en" }) {
  return (
    <Link
      href="/templates"
      className="border-2 border-dashed border-outline-variant/30 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-stone-400 hover:border-stitch-primary/40 hover:text-stitch-primary transition-all group"
    >
      <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
        <Plus size={20} strokeWidth={1.5} />
      </div>
      <span className="font-label text-[11px] uppercase tracking-widest font-semibold text-center">
        {lang === "id" ? "Mulai Perjalanan Undangan Baru" : "Start a New Invitation Journey"}
      </span>
    </Link>
  );
}

function OrderCard({ order, lang }: { readonly order: OrderRow; readonly lang: "id" | "en" }) {
  const gradient = getTemplateGradient(order.template);
  const createdDate = new Date(order.created_at);
  const formattedDate = createdDate.toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const isCompleted = order.status === "completed";
  const isInProgress = order.status === "in_progress" || order.status === "revision";
  const isPaid = order.status === "paid";

  const statusLabel = () => {
    if (isCompleted) return lang === "id" ? "Selesai" : "Completed";
    if (isInProgress) return lang === "id" ? "Sedang Dikerjakan" : "In Progress";
    if (isPaid) return lang === "id" ? "Sudah Bayar" : "Paid";
    return lang === "id" ? "Menunggu" : "Pending";
  };

  const statusStyle = () => {
    if (isCompleted) return "bg-stitch-primary-container/15 text-stitch-primary border border-stitch-primary-container/20";
    if (isInProgress) return "bg-stitch-primary/10 text-stitch-primary border border-stitch-primary/20";
    if (isPaid) return "bg-stone-100 text-stone-500 border border-stone-200";
    return "bg-stitch-error/10 text-stitch-error border border-stitch-error/20";
  };

  return (
    <div className="bg-[#f9f4f1] rounded-xl p-5 shadow-[0_20px_40px_rgba(43,43,43,0.05)] flex gap-5 items-start hover:-translate-y-1 transition-transform duration-500">
      {/* Template Preview Thumbnail */}
      <div className="w-28 h-40 rounded-lg bg-white shadow-inner overflow-hidden shrink-0 relative">
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(160deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          }}
        />
        {isInProgress && (
          <div className="absolute inset-0 bg-stone-900/10 flex items-center justify-center">
            <span className="text-white/50" style={{ fontSize: "48px" }}>✎</span>
          </div>
        )}
        {!order.template && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-stone-300" style={{ fontSize: "40px" }}>✦</span>
          </div>
        )}
      </div>

      {/* Order Info */}
      <div className="flex-1 flex flex-col h-full justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${statusStyle()}`}>
              {statusLabel()}
            </span>
            <span className="text-[11px] text-stone-400 shrink-0">{formattedDate}</span>
          </div>
          <h3 className="text-lg text-on-surface mb-0.5 truncate">{order.template ?? "Custom Curator Service"}</h3>
          <p className="text-stone-500 text-xs font-light tracking-wide uppercase">
            {order.groom_name} & {order.bride_name}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3 flex-wrap">
          {isCompleted ? (
            <>
              <button className="text-[11px] uppercase tracking-widest font-semibold text-stitch-primary underline underline-offset-4 hover:opacity-70 transition-opacity">
                {lang === "id" ? "Lihat Desain" : "View Design"}
              </button>
              <button className="text-[11px] uppercase tracking-widest font-semibold text-stone-400 hover:text-on-surface transition-colors">
                {lang === "id" ? "Download Assets" : "Download Assets"}
              </button>
            </>
          ) : isInProgress ? (
            <button
              className="text-white text-[10px] uppercase tracking-widest px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)" }}
            >
              {lang === "id" ? "Lanjutkan Editing" : "Resume Editing"}
            </button>
          ) : (
            <Link
              href={`/orders/${encodeURIComponent(order.order_code)}`}
              className="text-[11px] uppercase tracking-widest font-semibold text-stitch-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              {lang === "id" ? "Lihat Detail" : "View Details"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { lang } = useLanguage();
  const [orders, setOrders] = useState<TrackedOrder[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]") as string[];
      if (stored.length === 0) { setOrders([]); return; }
      setOrders(stored.map((code) => ({ orderCode: code, order: null, loading: true, error: false })));

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
    } catch { /* ignore */ }
  };

  const totalOrders = orders.filter((o) => o.order).length;
  const activeOrders = orders.filter((o) => o.order && ["in_progress", "revision", "paid"].includes(o.order!.status)).length;
  const completedOrders = orders.filter((o) => o.order && o.order.status === "completed").length;

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="customer" />

      <main className="ml-64 min-h-screen bg-white">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-12 py-8 flex justify-between items-end border-b border-outline-variant/10">
          <div>
            <h2 className="font-headline text-4xl italic text-on-surface tracking-tight">
              {lang === "id" ? "Undangan Saya" : "My Invitations"}
            </h2>
            <p className="text-stone-400 text-sm mt-2 font-light">
              {lang === "id"
                ? "Mengelola warisan digital dan cerita perayaan Anda."
                : "Managing your digital heirlooms and celebration stories."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-stitch-secondary-fixed flex items-center justify-center overflow-hidden">
              <span className="text-[10px] font-bold text-stitch-on-secondary-container">FV</span>
            </div>
          </div>
        </header>

        <section className="px-12 pb-20">
          {/* Bento Stats */}
          {orders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-8">
              <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-40">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                  {lang === "id" ? "Total Pesanan" : "Total Orders"}
                </span>
                <span className="text-5xl font-headline text-stitch-primary">{String(totalOrders).padStart(2, "0")}</span>
              </div>
              <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-40">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                  {lang === "id" ? "Aktif" : "Active Projects"}
                </span>
                <span className="text-5xl font-headline text-on-surface">{String(activeOrders).padStart(2, "0")}</span>
              </div>
              <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-40">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                  {lang === "id" ? "Selesai" : "Completed"}
                </span>
                <span className="text-5xl font-headline text-stitch-primary-container">{String(completedOrders).padStart(2, "0")}</span>
              </div>
            </div>
          )}

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order cards */}
            {orders.map(({ orderCode, order, loading, error }) => {
              if (loading) {
                return (
                  <div key={orderCode} className="flex items-center justify-center py-16 bg-[#f9f4f1] rounded-xl">
                    <Loader2 size={20} className="text-stitch-primary animate-spin" />
                  </div>
                );
              }
              if (error || !order) {
                return (
                  <div key={orderCode} className="border border-dashed border-outline-variant/30 rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm text-stitch-primary">{orderCode}</p>
                      <p className="text-xs text-stitch-error mt-0.5">
                        {lang === "id" ? "Pesanan tidak ditemukan" : "Order not found"}
                      </p>
                    </div>
                    <button
                      onClick={() => removeOrder(orderCode)}
                      className="text-[11px] text-stone-400 hover:text-stitch-error transition-colors"
                    >
                      {lang === "id" ? "Hapus" : "Remove"}
                    </button>
                  </div>
                );
              }
              return <OrderCard key={orderCode} order={order} lang={lang} />;
            })}

            {/* Empty / New invitation card */}
            <EmptyState lang={lang} />
          </div>
        </section>

        {/* Curator's Suggestions */}
        {orders.length > 0 && (
          <section className="mt-10 px-12 pb-16 border-t border-stone-100 pt-12">
            <h4 className="font-headline italic text-2xl text-on-surface mb-8">
              {lang === "id" ? "Saran dari Kurator" : "Curator's Suggestions"}
            </h4>
            <div className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col md:flex-row items-stretch">
              <div className="md:w-1/2 p-10 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stitch-primary mb-3 font-bold font-label">
                  {lang === "id" ? "Enhancement" : "Enhancement"}
                </span>
                <h5 className="text-2xl font-headline mb-5 leading-tight text-on-surface">
                  {lang === "id" ? "Warisan Fisik: Cetakan Kenang-kenangan" : "The Physical Heirloom: Printed Keepsakes"}
                </h5>
                <p className="text-stone-500 mb-7 font-light leading-relaxed text-sm">
                  {lang === "id"
                    ? "Ubah undangan digital Anda menjadi sejarah nyata. Pesan edisi terbatas kami dengan kertas katun dan segel lilin yang ditekan tangan."
                    : "Turn your digital invitations into tangible history. Order our limited edition cotton-paper prints with hand-pressed wax seals."}
                </p>
                <button
                  className="self-start px-7 py-3 border border-stitch-primary text-stitch-primary rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-stitch-primary hover:text-white transition-all"
                  onClick={() => window.location.href = "/templates"}
                >
                  {lang === "id" ? "Jelajahi" : "Explore"}
                </button>
              </div>
              <div className="md:w-1/2 min-h-[280px] bg-gradient-to-br from-[#735c00]/10 to-[#d4af37]/20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 opacity-50">
                  <div className="w-16 h-20 border-2 border-stitch-primary/30 rotate-12" />
                  <span className="font-label text-[10px] uppercase tracking-widest text-stone-400">Preview</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <Loader2 size={24} className="text-stitch-primary animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}