"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Package } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { StatusBadge, needsPayment, isCompleted } from "@/components/shared/StatusBadge";
import type { OrderRow } from "@/types";
import { formatIDR } from "@/lib/utils";
import { WA_NUMBER } from "@/lib/config";
import { SectionHeading } from "@/components/shared/SectionHeading";

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <Loader2 size={24} className="text-[#c9a96e] animate-spin" />
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}

function OrderDetailContent() {
  const params = useParams();
  const orderCode = decodeURIComponent(String(params.code ?? ""));
  const { t, lang } = useLanguage();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderCode) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders?orderCode=${encodeURIComponent(orderCode)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <Loader2 size={24} className="text-[#c9a96e] animate-spin" />
        <p className="text-[#6a6a6a] text-sm">{lang === "id" ? "Memuat..." : "Loading..."}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="font-serif text-3xl text-[#faf8f5]">
          {lang === "id" ? "Pesanan Tidak Ditemukan" : "Order Not Found"}
        </h1>
        <p className="text-[#6a6a6a] text-sm text-center max-w-sm">
          {lang === "id"
            ? "Kode pesanan tidak valid atau pesanan sudah dihapus."
            : "Order code is invalid or the order has been removed."}
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs text-[#c9a96e] hover:text-[#d4b87a] transition-colors"
        >
          <ArrowLeft size={12} />
          {lang === "id" ? "Kembali ke Dashboard" : "Back to Dashboard"}
        </Link>
      </div>
    );
  }

  const createdDate = new Date(order.created_at);
  const formattedDate = createdDate.toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = createdDate.toLocaleTimeString(lang === "id" ? "id-ID" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const waSupportMessage = `Halo FOR Vows! Saya perlu bantuan terkait pesanan ${order.order_code}. Terima kasih! 🙏`;
  const waSupportHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waSupportMessage)}`;

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#6a6a6a] hover:text-[#c9a96e] transition-colors"
          >
            <ArrowLeft size={12} />
            {lang === "id" ? "Kembali ke Dashboard" : "Back to Dashboard"}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <SectionHeading
            overline={lang === "id" ? "Detail Pesanan" : "Order Details"}
            title={order.order_code}
          />
          <div className="flex items-center gap-3 mt-3">
            <StatusBadge status={order.status} lang={lang} />
            <span className="text-xs text-[#6a6a6a]">{formattedDate} · {formattedTime}</span>
          </div>
        </div>

        {/* Payment CTA */}
        {needsPayment(order.status) && (
          <div className="mb-8 p-5 border border-[#c9a96e]/30 bg-[#c9a96e]/5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-[#8a8a8a] mb-1">
                  {lang === "id" ? "Total yang harus dibayar:" : "Amount due:"}
                </p>
                <p className="font-serif text-2xl text-[#faf8f5]">
                  {order.final_total != null ? formatIDR(order.final_total) : order.total_price != null ? formatIDR(order.total_price) : "—"}
                </p>
              </div>
              <Link
                href={`/order-success?code=${encodeURIComponent(order.order_code)}`}
                className="shrink-0 flex items-center gap-2 px-6 py-3.5 bg-[#c9a96e] text-[#0a0a0a] text-[11px] tracking-widest uppercase font-medium hover:bg-[#d4b87a] transition-colors"
              >
                {lang === "id" ? "Bayar Sekarang" : "Pay Now"}
                <ArrowRight size={14} />
              </Link>
            </div>
            <p className="text-[10px] text-[#6a6a6a] mt-3">
              {lang === "id"
                ? "Pembayaran diproses secara aman via Midtrans."
                : "Payments are securely processed via Midtrans."}
            </p>
          </div>
        )}

        {/* Order Details */}
        <div className="border border-white/6 divide-y divide-white/5 mb-6">
          {/* Couple */}
          <div className="px-5 py-4">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-1">
              {lang === "id" ? "Mempelai" : "Couple"}
            </p>
            <p className="text-[#faf8f5]">
              {order.groom_name} & {order.bride_name}
            </p>
          </div>

          {/* Package */}
          {order.package_name && (
            <div className="px-5 py-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-1">
                {lang === "id" ? "Paket" : "Package"}
              </p>
              <div className="flex items-center gap-2">
                <Package size={13} className="text-[#c9a96e]" />
                <p className="text-[#faf8f5]">{order.package_name}</p>
              </div>
            </div>
          )}

          {/* Template */}
          {order.template && (
            <div className="px-5 py-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-1">
                {lang === "id" ? "Template" : "Template"}
              </p>
              <p className="text-[#faf8f5]">{order.template}</p>
            </div>
          )}

          {/* Wedding Date */}
          {order.wedding_date && (
            <div className="px-5 py-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-1">
                {lang === "id" ? "Tanggal Pernikahan" : "Wedding Date"}
              </p>
              <p className="text-[#faf8f5]">{order.wedding_date}</p>
            </div>
          )}

          {/* Phone */}
          <div className="px-5 py-4">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-1">WhatsApp</p>
            <a
              href={`https://wa.me/${order.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c9a96e] hover:text-[#d4b87a] transition-colors"
            >
              {order.phone}
            </a>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="px-5 py-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-1">
                {lang === "id" ? "Catatan" : "Notes"}
              </p>
              <p className="text-[#8a8a8a] text-sm leading-relaxed whitespace-pre-wrap">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        {(order.total_price != null || order.final_total != null) && (
          <div className="border border-white/6 bg-[#0f0f0f] px-5 py-4 mb-6 space-y-2">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-2">
              {lang === "id" ? "Ringkasan Pembayaran" : "Payment Summary"}
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-[#8a8a8a]">
                {lang === "id" ? "Subtotal" : "Subtotal"}
              </span>
              <span className="text-[#faf8f5]">
                {order.total_price != null ? formatIDR(order.total_price) : "—"}
              </span>
            </div>
            {order.discount_amount != null && order.discount_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-400">
                  {lang === "id" ? "Diskon" : "Discount"}
                  {order.referral_code && ` (${order.referral_code})`}
                </span>
                <span className="text-green-400">-{formatIDR(order.discount_amount)}</span>
              </div>
            )}
            {order.discount_note && (
              <p className="text-[10px] text-[#6a6a6a]">{order.discount_note}</p>
            )}
            <div className="h-px bg-white/6 my-1" />
            <div className="flex justify-between">
              <span className="text-[#faf8f5] font-medium">
                {lang === "id" ? "Total" : "Total"}
              </span>
              <span className="font-serif text-lg text-[#faf8f5]">
                {order.final_total != null ? formatIDR(order.final_total) : order.total_price != null ? formatIDR(order.total_price) : "—"}
              </span>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="border border-white/6 bg-[#0f0f0f] px-5 py-5 mb-6">
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-4">
            {lang === "id" ? "Status Pesanan" : "Order Status"}
          </p>
          <OrderTimeline status={order.status} lang={lang} />
        </div>

        {/* Support CTA */}
        <div className="text-center space-y-3">
          <a
            href={waSupportHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-[11px] tracking-widest uppercase border border-white/15 text-[#8a8a8a] hover:border-[#c9a96e]/40 hover:text-[#c9a96e] transition-all"
          >
            {lang === "id" ? "Hubungi Support via WhatsApp" : "Contact Support via WhatsApp"}
          </a>
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs text-[#6a6a6a] hover:text-[#8a8a8a] transition-colors"
            >
              <ArrowLeft size={11} />
              {lang === "id" ? "Semua Pesanan" : "All Orders"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Order Timeline ─────────────────────────────────────────────────────────────

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

function OrderTimeline({ status, lang }: { status: string; lang: "id" | "en" }) {
  const steps = lang === "id" ? STATUS_STEPS_ID : STATUS_STEPS_EN;
  const activeIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;
        const isPending = i > activeIndex;

        return (
          <div key={step.key} className="flex items-start gap-3">
            {/* Connector line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isDone
                    ? "bg-[#c9a96e]"
                    : isActive
                    ? "border-2 border-[#c9a96e] bg-transparent"
                    : "border border-white/15 bg-transparent"
                }`}
              >
                {isDone && <Check size={10} className="text-[#0a0a0a]" />}
                {isActive && <div className="w-2 h-2 rounded-full bg-[#c9a96e]" />}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-px flex-1 my-1 ${
                    isDone ? "bg-[#c9a96e]/40" : "bg-white/10"
                  }`}
                  style={{ minHeight: "20px" }}
                />
              )}
            </div>
            <p
              className={`text-xs pt-0.5 pb-4 ${
                isDone
                  ? "text-[#c9a96e]"
                  : isActive
                  ? "text-[#faf8f5]"
                  : "text-[#6a6a6a]"
              }`}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
