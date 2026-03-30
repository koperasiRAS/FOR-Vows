"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Check, Loader2, MessageCircle, Phone, Clock, FileText, Download, Edit2, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/context";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { formatIDR } from "@/lib/utils";
import type { OrderRow } from "@/types";
import { WA_NUMBER } from "@/lib/config";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "waiting_payment", label: "Waiting Payment" },
  { value: "paid", label: "Paid" },
  { value: "in_progress", label: "In Progress" },
  { value: "revision", label: "Revision" },
  { value: "completed", label: "Completed" },
];

const STATUS_STEPS_ID = [
  { key: "pending", label: "Pesanan Diterima" },
  { key: "waiting_payment", label: "Menunggu Pembayaran" },
  { key: "paid", label: "Pembayaran Diterima" },
  { key: "in_progress", label: "Sedang Dikerjakan" },
  { key: "revision", label: "Revisi" },
  { key: "completed", label: "Selesai" },
];
const STATUS_STEPS_EN = [
  { key: "pending", label: "Order Received" },
  { key: "waiting_payment", label: "Awaiting Payment" },
  { key: "paid", label: "Payment Received" },
  { key: "in_progress", label: "In Progress" },
  { key: "revision", label: "Revision" },
  { key: "completed", label: "Completed" },
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useLanguage();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const orderId = String(params.id ?? "");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/admin/login"); return; }
      setUserEmail(data.user.email ?? "");
    });

    if (!orderId) { setLoading(false); return; }
    fetch(`/api/orders`)
      .then((r) => r.json())
      .then((data) => {
        const found = (data.orders ?? []).find((o: OrderRow) => o.id === orderId);
        if (found) setOrder(found);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) setOrder((prev) => prev ? { ...prev, status: newStatus as OrderRow["status"] } : prev);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      }).format(new Date(dateStr));
    } catch { return dateStr; }
  };

  const steps = lang === "id" ? STATUS_STEPS_ID : STATUS_STEPS_EN;
  const activeIndex = order ? steps.findIndex((s) => s.key === order.status) : -1;
  const waMessage = order
    ? `Halo FOR Vows! Saya ingin konsultasi terkait pesanan ${order.order_code}. Terima kasih!`
    : "";
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;
  const waCustomerHref = order
    ? `https://wa.me/${order.phone.replace(/\D/g, "")}`
    : "#";

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-stitch-primary-container/30 border-t-stitch-primary rounded-full animate-spin" />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 px-6">
      <h1 className="font-headline text-3xl text-on-surface">
        {lang === "id" ? "Pesanan Tidak Ditemukan" : "Order Not Found"}
      </h1>
      <Link href="/admin/orders" className="text-sm text-stitch-primary hover:underline">
        ← {lang === "id" ? "Kembali ke Semua Pesanan" : "Back to All Orders"}
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="admin" />

      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-12 py-8 border-b border-outline-variant/10">
          <div className="flex items-center gap-3 text-sm text-stone-400 mb-2">
            <Link href="/admin/orders" className="hover:text-stitch-primary transition-colors flex items-center gap-1">
              <ChevronLeft size={14} strokeWidth={1.5} />
              {lang === "id" ? "Semua Pesanan" : "All Orders"}
            </Link>
            <span>/</span>
            <span className="text-stitch-primary font-medium">{order.order_code}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                {order.groom_name} & {order.bride_name}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-stone-400">{userEmail}</span>
              <div className="w-9 h-9 rounded-full bg-stitch-secondary-fixed flex items-center justify-center text-xs font-bold">
                {userEmail ? userEmail.split("@")[0].slice(0, 2).toUpperCase() : "AD"}
              </div>
            </div>
          </div>
        </header>

        <section className="px-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 mt-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Order Summary Card */}
              <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)]">
                <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10">
                  <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-secondary">
                    {lang === "id" ? "Ringkasan Pesanan" : "Order Summary"}
                  </h3>
                </div>
                <div className="divide-y divide-outline-variant/10">
                  <div className="grid grid-cols-2">
                    <div className="px-6 py-4 border-r border-outline-variant/10">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">
                        {lang === "id" ? "Package" : "Package"}
                      </p>
                      <p className="font-serif italic text-on-surface">{order.package_name ?? "—"}</p>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">
                        {lang === "id" ? "Template" : "Template"}
                      </p>
                      <p className="font-serif italic text-on-surface">{order.template ?? "—"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-6 py-4 border-r border-outline-variant/10">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">
                        {lang === "id" ? "Tanggal Pernikahan" : "Wedding Date"}
                      </p>
                      <p className="text-on-surface">{order.wedding_date ?? "—"}</p>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">
                        {lang === "id" ? "Tanggal Pesanan" : "Order Date"}
                      </p>
                      <p className="text-on-surface text-sm">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  {order.total_price != null && (
                    <div className="px-6 py-4 bg-surface-container-low/30">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-stone-500">{lang === "id" ? "Total" : "Total"}</span>
                        <span className="font-headline text-xl text-on-surface">{formatIDR(order.final_total ?? order.total_price)}</span>
                      </div>
                      {order.discount_amount != null && order.discount_amount > 0 && (
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-green-600">{lang === "id" ? "Diskon" : "Discount"}</span>
                          <span className="text-xs text-green-600">-{formatIDR(order.discount_amount)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {order.notes && (
                    <div className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-2">
                        {lang === "id" ? "Catatan" : "Notes"}
                      </p>
                      <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Journey Progress */}
              <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)]">
                <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
                  <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-secondary">
                    {lang === "id" ? "Perjalanan Pesanan" : "Order Journey"}
                  </h3>
                  <select
                    value={order.status}
                    disabled={updating}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-stitch-primary-container/15 text-stitch-primary border border-stitch-primary-container/20 cursor-pointer focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="px-6 py-5">
                  <div className="space-y-0">
                    {steps.map((step, i) => {
                      const isDone = i < activeIndex;
                      const isActive = i === activeIndex;
                      return (
                        <div key={step.key} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isDone ? "bg-stitch-primary" : isActive ? "border-2 border-stitch-primary bg-transparent" : "border border-outline-variant bg-transparent"
                            }`}>
                              {isDone && <Check size={10} className="text-white" strokeWidth={2.5} />}
                              {isActive && <div className="w-2 h-2 rounded-full bg-stitch-primary" />}
                            </div>
                            {i < steps.length - 1 && (
                              <div className={`w-px flex-1 my-1 ${isDone ? "bg-stitch-primary/40" : "bg-outline-variant/30"}`} style={{ minHeight: "20px" }} />
                            )}
                          </div>
                          <p className={`text-xs pt-0.5 pb-4 ${
                            isDone ? "text-stitch-primary" : isActive ? "text-on-surface font-medium" : "text-stone-400"
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Invitation Preview */}
              <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)]">
                <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10">
                  <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-secondary">
                    {lang === "id" ? "Preview Undangan" : "Invitation Preview"}
                  </h3>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#735c00]/10 to-[#d4af37]/20 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-stitch-primary/20 rotate-45" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <p className="font-serif italic text-xl text-stitch-primary/60">{order.template ?? "Custom Template"}</p>
                    <div className="w-10 h-px bg-stitch-primary/30" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">FOR Vows Preview</p>
                  </div>
                </div>
                <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/10">
                  <div className="flex items-center gap-2 text-outline">
                    <Eye size={14} strokeWidth={1.5} />
                    <span className="text-xs">{lang === "id" ? "Preview lengkap setelah selesai" : "Full preview when complete"}</span>
                  </div>
                  {order.status === "completed" && (
                    <button className="flex items-center gap-2 text-xs text-stitch-primary font-semibold hover:opacity-80 transition-opacity">
                      <Download size={13} strokeWidth={1.5} />
                      {lang === "id" ? "Download Final" : "Download Final"}
                    </button>
                  )}
                </div>
              </div>

              {/* Customer Contact */}
              <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)]">
                <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10">
                  <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-secondary">
                    {lang === "id" ? "Kontak Pelanggan" : "Customer Contact"}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">
                      {lang === "id" ? "Nama" : "Name"}
                    </p>
                    <p className="text-sm font-semibold text-on-surface">{order.groom_name} & {order.bride_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">WhatsApp</p>
                    <a
                      href={waCustomerHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-stitch-primary hover:underline"
                    >
                      <Phone size={13} strokeWidth={1.5} />
                      {order.phone}
                    </a>
                  </div>
                  <div className="pt-2">
                    <a
                      href={waCustomerHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-xs uppercase tracking-widest font-semibold shadow-[0_8px_24px_rgba(115,92,0,0.25)] hover:opacity-90 transition-all"
                      style={{ background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)" }}
                    >
                      <MessageCircle size={14} strokeWidth={1.5} />
                      {lang === "id" ? "Hubungi via WhatsApp" : "Contact via WhatsApp"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Concierge Support */}
              <div className="bg-surface-container-low rounded-[1rem] p-6 border border-stitch-primary-container/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-stitch-primary-container/20 flex items-center justify-center">
                    <Clock size={15} strokeWidth={1.5} className="text-stitch-primary" />
                  </div>
                  <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-primary font-semibold">
                    {lang === "id" ? "Concierge Support" : "Concierge Support"}
                  </h3>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed mb-4">
                  {lang === "id"
                    ? "Butuh bantuan lanjutan? Hubungi tim kami langsung."
                    : "Need further assistance? Reach our team directly."}
                </p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-stitch-primary text-stitch-primary rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-stitch-primary hover:text-white transition-all"
                >
                  <MessageCircle size={14} strokeWidth={1.5} />
                  {lang === "id" ? "Hubungi Tim FOR Vows" : "Contact FOR Vows Team"}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}