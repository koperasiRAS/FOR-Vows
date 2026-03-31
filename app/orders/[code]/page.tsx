"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, Check, MessageCircle, Phone, Download,
  ZoomIn, ZoomOut, Share2, FileText, Clock
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { formatIDR } from "@/lib/utils";
import type { OrderRow } from "@/types";
import { WA_NUMBER } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

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

function OrderTimeline({ status, locale }: { readonly status: string; readonly locale: "id" | "en" }) {
  const steps = locale === "id" ? STATUS_STEPS_ID : STATUS_STEPS_EN;
  const activeIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;

        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                isDone
                  ? "bg-stitch-primary"
                  : isActive
                  ? "border-2 border-stitch-primary bg-transparent"
                  : "border border-outline-variant bg-transparent"
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
  );
}

function PaymentBanner({ order, locale }: { readonly order: OrderRow; readonly locale: "id" | "en" }) {
  if (order.status !== "pending" && order.status !== "waiting_payment") return null;
  if (order.final_total == null) return null;

  return (
    <div className="mb-6 p-5 bg-surface-container-low rounded-xl border border-stitch-primary-container/20 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <p className="text-xs text-stone-500 mb-1">
          {locale === "id" ? "Total yang harus dibayar:" : "Amount due:"}
        </p>
        <p className="font-headline text-2xl text-on-surface">
          {formatIDR(order.final_total)}
        </p>
        <p className="text-[10px] text-stone-400 mt-1">
          {locale === "id"
            ? "Pembayaran diproses secara aman via Midtrans."
            : "Payments are securely processed via Midtrans."}
        </p>
      </div>
      <Link
        href={`/order-success?code=${encodeURIComponent(order.order_code)}`}
        className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl text-white text-xs uppercase tracking-widest font-semibold shadow-[0_8px_24px_rgba(115,92,0,0.25)] hover:opacity-90 transition-all"
        style={{ background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)" }}
      >
        {locale === "id" ? "Bayar Sekarang" : "Pay Now"}
        <ChevronLeft size={14} className="rotate-180" strokeWidth={2} />
      </Link>
    </div>
  );
}

function OrderDetailContent() {
  const params = useParams();
  const router = useRouter();
  const orderCode = decodeURIComponent(String(params.code ?? ""));
  const { lang: locale } = useLanguage();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // C4: Require login before showing order details
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace(`/auth/login?redirectTo=/orders/${encodeURIComponent(orderCode)}`);
      } else {
        setAuthChecked(true);
      }
    });
  }, [orderCode, router]);

  useEffect(() => {
    if (!orderCode || !authChecked) { setLoading(false); return; }
    fetch(`/api/orders?orderCode=${encodeURIComponent(orderCode)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.order) setOrder(data.order);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderCode, authChecked]);

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-stitch-primary-container/30 border-t-stitch-primary rounded-full animate-spin" />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 px-6">
      <h1 className="font-headline text-3xl text-on-surface">
        {locale === "id" ? "Pesanan Tidak Ditemukan" : "Order Not Found"}
      </h1>
      <Link href="/dashboard" className="text-sm text-stitch-primary hover:underline">
        ← {locale === "id" ? "Kembali ke Dashboard" : "Back to Dashboard"}
      </Link>
    </div>
  );

  const createdDate = new Date(order.created_at);
  const formattedDate = createdDate.toLocaleDateString(locale === "id" ? "id-ID" : "en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const formattedTime = createdDate.toLocaleTimeString(locale === "id" ? "id-ID" : "en-GB", {
    hour: "2-digit", minute: "2-digit",
  });

  const waSupportHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Halo FOR Vows! Saya perlu bantuan terkait pesanan ${order.order_code}. Terima kasih!`
  )}`;
  const waCustomerHref = `https://wa.me/${order.phone.replaceAll(/\D/g, "")}`;

  const statusBadgeStyle = () => {
    if (order.status === "completed") return "bg-stitch-primary-container/15 text-stitch-primary border border-stitch-primary-container/20";
    if (order.status === "in_progress" || order.status === "revision") return "bg-stitch-primary/10 text-stitch-primary border border-stitch-primary/20";
    if (order.status === "paid") return "bg-stone-100 text-stone-500 border border-stone-200";
    return "bg-stitch-error/10 text-stitch-error border border-stitch-error/20";
  };

  const statusBadgeLabel = () => {
    if (locale === "id") {
      if (order.status === "in_progress") return "Sedang Dikerjakan";
      if (order.status === "completed") return "Selesai";
      if (order.status === "paid") return "Sudah Bayar";
      if (order.status === "pending") return "Pending";
      if (order.status === "waiting_payment") return "Menunggu Bayar";
      if (order.status === "revision") return "Revisi";
      return order.status;
    } else {
      if (order.status === "in_progress") return "In Progress";
      if (order.status === "completed") return "Completed";
      if (order.status === "paid") return "Paid";
      return order.status;
    }
  };

  const templateGradientFrom = "#2c1810";
  const templateGradientTo = "#735c00";

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="customer" />

      <main className="ml-64 min-h-screen bg-white">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-12 py-8 flex justify-between items-end border-b border-outline-variant/10">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-stone-400 mb-2">
              <Link href="/dashboard" className="hover:text-stitch-primary transition-colors flex items-center gap-1">
                <ChevronLeft size={14} strokeWidth={1.5} />
                {locale === "id" ? "Undangan Saya" : "My Orders"}
              </Link>
              <span>/</span>
              <span className="text-stitch-primary font-medium font-mono text-xs">{order.order_code}</span>
            </div>
            <h2 className="font-headline text-3xl italic text-on-surface tracking-tight">
              {order.groom_name} & {order.bride_name}
            </h2>
            <p className="text-sm text-stone-400 mt-1">{formattedDate} · {formattedTime}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${statusBadgeStyle()}`}>
              {statusBadgeLabel()}
            </span>
          </div>
        </header>

        <section className="px-12 pb-24">
          <PaymentBanner order={order} locale={locale} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 mt-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Order Info Card */}
              <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)]">
                <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10">
                  <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-secondary">
                    {locale === "id" ? "Detail Pesanan" : "Order Details"}
                  </h3>
                </div>
                <div className="divide-y divide-outline-variant/10">
                  <div className="grid grid-cols-2">
                    <div className="px-6 py-4 border-r border-outline-variant/10">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">
                        {locale === "id" ? "Paket" : "Package"}
                      </p>
                      <p className="font-serif italic text-on-surface">{order.package_name ?? "—"}</p>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">
                        {"Template"}
                      </p>
                      <p className="font-serif italic text-on-surface">{order.template ?? "—"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-6 py-4 border-r border-outline-variant/10">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">
                        {locale === "id" ? "Tanggal Pernikahan" : "Wedding Date"}
                      </p>
                      <p className="text-on-surface">{order.wedding_date ?? "—"}</p>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">WhatsApp</p>
                      <a
                        href={waCustomerHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-stitch-primary hover:underline"
                      >
                        <Phone size={12} strokeWidth={1.5} />
                        {order.phone}
                      </a>
                    </div>
                  </div>
                  {order.total_price != null && (
                    <div className="px-6 py-4 bg-surface-container-low/30">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-stone-500">Total</span>
                        <span className="font-headline text-xl text-on-surface">{formatIDR(order.final_total ?? order.total_price)}</span>
                      </div>
                      {order.discount_amount != null && order.discount_amount > 0 && (
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-green-600">{locale === "id" ? "Diskon" : "Discount"}</span>
                          <span className="text-xs text-green-600">-{formatIDR(order.discount_amount)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {order.notes && (
                    <div className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-2">
                        {locale === "id" ? "Catatan" : "Notes"}
                      </p>
                      <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Journey Timeline */}
              <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)]">
                <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10">
                  <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-secondary">
                    {locale === "id" ? "Perjalanan Pesanan" : "Order Journey"}
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <OrderTimeline status={order.status} locale={locale} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Invitation Preview */}
              <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)]">
                <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
                  <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-secondary">
                    {locale === "id" ? "Preview Undangan" : "Invitation Preview"}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-full hover:bg-surface-container transition-colors text-outline" title={locale === "id" ? "Perbesar" : "Zoom in"}>
                      <ZoomIn size={15} strokeWidth={1.5} />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-surface-container transition-colors text-outline" title={locale === "id" ? "Perkecil" : "Zoom out"}>
                      <ZoomOut size={15} strokeWidth={1.5} />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-surface-container transition-colors text-outline" title={locale === "id" ? "Bagikan" : "Share"}>
                      <Share2 size={15} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                <div className="relative aspect-4/3 overflow-hidden flex items-center justify-center">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(160deg, ${templateGradientFrom} 0%, ${templateGradientTo} 100%)`,
                    }}
                  />
                  <div className="w-20 h-20 border-2 border-white/20 rotate-45 relative z-10" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                    <p className="font-serif italic text-xl text-white/60">
                      {order.template ?? "Custom Template"}
                    </p>
                    <div className="w-10 h-px bg-white/30" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      FOR Vows Preview
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/10">
                  <span className="text-xs text-stone-400">
                    {locale === "id" ? "Preview lengkap setelah selesai" : "Full preview when complete"}
                  </span>
                  {order.status === "completed" && (
                    <button className="flex items-center gap-2 text-xs text-stitch-primary font-semibold hover:opacity-80 transition-opacity">
                      <Download size={13} strokeWidth={1.5} />
                      {locale === "id" ? "Download Final" : "Download Assets"}
                    </button>
                  )}
                </div>
              </div>

              {/* Request Change */}
              {order.status !== "completed" && (
                <div className="bg-surface-container-low rounded-[1rem] p-5 border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText size={16} strokeWidth={1.5} className="text-stitch-primary" />
                    <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-primary font-semibold">
                      {locale === "id" ? "Permintaan Perubahan" : "Request Change"}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed mb-4">
                    {locale === "id"
                      ? "Butuh revisi atau perubahan pada desain? Kirimkan permintaan Anda."
                      : "Need revisions or changes to the design? Submit your request."}
                  </p>
                  <button
                    onClick={() => window.open(waSupportHref, "_blank")}
                    className="flex items-center justify-center gap-2 w-full py-3 border border-stitch-primary text-stitch-primary rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-stitch-primary hover:text-white transition-all"
                  >
                    <MessageCircle size={14} strokeWidth={1.5} />
                    {locale === "id" ? "Ajukan Permintaan" : "Submit Request"}
                  </button>
                </div>
              )}

              {/* Concierge Support */}
              <div className="bg-surface-container-low rounded-[1rem] p-5 border border-stitch-primary-container/20">
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={16} strokeWidth={1.5} className="text-stitch-primary" />
                  <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-primary font-semibold">
                    {locale === "id" ? "Concierge Support" : "24/7 Support"}
                  </h3>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed mb-4">
                  {locale === "id"
                    ? "Tim kami siap membantu 24/7 untuk setiap pertanyaan."
                    : "Our team is ready to help 24/7 for any questions."}
                </p>
                <a
                  href={waSupportHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-xs uppercase tracking-widest font-semibold shadow-[0_8px_24px_rgba(115,92,0,0.25)] hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)" }}
                >
                  <MessageCircle size={14} strokeWidth={1.5} />
                  {locale === "id" ? "Hubungi via WhatsApp" : "Contact via WhatsApp"}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-stitch-primary-container/30 border-t-stitch-primary rounded-full animate-spin" />
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}