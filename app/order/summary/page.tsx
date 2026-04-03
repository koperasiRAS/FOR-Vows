"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  MessageCircle,
  Package,
  Calendar,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { WA_NUMBER } from "@/lib/config";
import { formatIDR } from "@/lib/utils";
import type { OrderRow } from "@/types";

// ── Category label map ─────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  undangan: "Undangan Digital",
  foto:     "Foto & Video Wedding",
  content:  "Wedding Content Creator",
  souvenir: "Desain Souvenir",
};

// ── Skeleton ───────────────────────────────────────────────────────────────────
function SummarySkeleton() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-lg mx-auto space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-white/5 rounded" />
        <div className="h-64 bg-white/5 rounded-2xl" />
        <div className="h-32 bg-white/5 rounded-2xl" />
        <div className="h-14 bg-white/5 rounded-xl" />
        <div className="h-14 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function SummaryError({ message }: { message: string }) {
  return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">✕</span>
        </div>
        <h1 className="font-serif text-2xl text-[#faf8f5]">Pesanan Tidak Ditemukan</h1>
        <p className="text-[#6a6a6a] text-sm">{message}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#c9a96e] hover:text-[#d4b87a] transition-colors border-b border-[#c9a96e]/30 hover:border-[#c9a96e] pb-0.5"
        >
          <ArrowLeft size={12} />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

// ── Detail row helper ─────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <Icon size={14} className="text-[#c9a96e] mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.1em] uppercase text-[#6a6a6a] mb-0.5">{label}</p>
        <p className="text-sm text-[#faf8f5] leading-snug">{value}</p>
      </div>
    </div>
  );
}

// ── Main content ───────────────────────────────────────────────────────────────
function SummaryContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("id");

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderCode) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    fetch(`/api/orders?orderCode=${encodeURIComponent(orderCode)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [orderCode]);

  if (loading) return <SummarySkeleton />;
  if (notFound || !order) {
    return (
      <SummaryError message="Kode pesanan tidak valid atau sudah kedaluwarsa. Pastikan Anda menggunakan link yang benar dari email atau WhatsApp kami." />
    );
  }

  const category = (order as OrderRow & { service_category?: string }).service_category ?? "undangan";
  const serviceDetails = (order as OrderRow & { service_details?: Record<string, unknown> }).service_details ?? {};
  const categoryLabel = CATEGORY_LABELS[category] ?? category;

  // Format date helper
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(dateStr + "T00:00:00"));
    } catch {
      return dateStr;
    }
  };

  // Display name — could be bride/groom, couple name, or orderer name
  // Guard: serviceDetails may contain arrays/objects from DB; extract only string primitives
  const sd: Record<string, string | number | boolean | null | undefined> =
    (serviceDetails && typeof serviceDetails === "object" && !Array.isArray(serviceDetails))
      ? serviceDetails as Record<string, string | number | boolean | null | undefined>
      : {};
  const displayName =
    order.bride_name && order.groom_name && order.bride_name !== "—"
      ? `${order.bride_name} & ${order.groom_name}`
      : (order.bride_name && order.bride_name !== "—"
      ? order.bride_name
      : sd.orderer_name
      ? String(sd.orderer_name)
      : sd.couple_name
      ? String(sd.couple_name)
      : "—");

  const waMessage = `Halo FOR Vows, saya baru saja melakukan pemesanan dengan ID: ${order.order_code}. Mohon konfirmasi pesanan saya. Terima kasih.`;
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <div className="max-w-lg mx-auto px-6 space-y-8">

        {/* ── Back link ── */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#6a6a6a] hover:text-[#c9a96e] transition-colors"
        >
          <ArrowLeft size={12} />
          Kembali ke Beranda
        </Link>

        {/* ── 1. Success Header ── */}
        <div className="text-center space-y-3 pt-4">
          <div className="w-20 h-20 bg-[#c9a96e]/10 border-2 border-[#c9a96e]/30 rounded-full flex items-center justify-center mx-auto">
            <Check size={36} className="text-[#c9a96e]" strokeWidth={2.5} />
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl text-[#faf8f5]">
            Pesanan Berhasil Diterima!
          </h1>
          <p className="text-[#8a8a8a] text-sm leading-relaxed">
            Tim kami akan segera menghubungi Anda dalam 1×24 jam melalui WhatsApp untuk konfirmasi detail pesanan.
          </p>
        </div>

        {/* ── 2. Order Summary Card ── */}
        <div className="bg-[#141414] rounded-2xl border border-white/8 overflow-hidden">
          {/* Order ID badge */}
          <div className="bg-[#0f0f0f] px-6 py-4 border-b border-white/5 text-center">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#c9a96e] mb-1">Order ID</p>
            <p className="font-mono text-lg text-[#c9a96e] tracking-wider">{order.order_code}</p>
          </div>

          <div className="px-6 py-5 space-y-0">
            {/* Category */}
            <DetailRow icon={Package} label="Layanan" value={categoryLabel} />

            {/* Package */}
            {order.package_name && (
              <DetailRow icon={Package} label="Paket" value={order.package_name} />
            )}

            {/* Template (undangan) */}
            {(order.template_name || order.template) && (
              <DetailRow
                icon={Package}
                label="Template"
                value={order.template_name ?? order.template}
              />
            )}

            {/* Harga */}
            {order.final_total != null && (
              <div className="flex items-start gap-3 py-3 border-b border-white/5">
                <span className="text-[#c9a96e] mt-0.5"><Package size={14} /></span>
                <div className="min-w-0">
                  <p className="text-[10px] tracking-[0.1em] uppercase text-[#6a6a6a] mb-0.5">Estimasi Harga</p>
                  <p className="font-serif text-lg text-[#c9a96e]">
                    {formatIDR(order.final_total)}
                  </p>
                </div>
              </div>
            )}

            {/* Nama pasangan / pemesan */}
            <DetailRow icon={User} label="Nama" value={displayName} />

            {/* Tanggal acara */}
            {(() => {
              const dateStr =
                formatDate(sd.event_date as string) ||
                formatDate(sd.wedding_date as string) ||
                formatDate(order.wedding_date);
              return dateStr ? (
                <DetailRow icon={Calendar} label="Tanggal Acara" value={dateStr} />
              ) : null;
            })()}

            {/* WhatsApp */}
            {order.phone && (
              <DetailRow icon={Phone} label="WhatsApp" value={order.phone} />
            )}

            {/* Venue */}
            {(() => {
              const venue =
                (sd.event_location as string) ||
                (sd.akad_location as string) ||
                order.venue ||
                null;
              return venue ? (
                <DetailRow icon={MapPin} label="Lokasi" value={venue} />
              ) : null;
            })()}

            {/* Event type (content) */}
            {sd.event_type && (
              <DetailRow
                icon={Package}
                label="Jenis Event"
                value={String(sd.event_type)}
              />
            )}

            {/* Quantity (souvenir) */}
            {sd.quantity != null && (
              <DetailRow
                icon={Package}
                label="Jumlah"
                value={`${sd.quantity} pcs`}
              />
            )}

            {/* Souvenir name (souvenir) */}
            {sd.souvenir_name && (
              <DetailRow
                icon={Package}
                label="Nama di Souvenir"
                value={String(sd.souvenir_name)}
              />
            )}
          </div>

          {/* Status */}
          <div className="px-6 pb-5 text-center">
            <span className="inline-block text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/25">
              Menunggu Konfirmasi
            </span>
          </div>
        </div>

        {/* ── 3. Next Steps ── */}
        <div className="space-y-4">
          <h2 className="text-[10px] tracking-[0.25em] uppercase text-[#c9a96e] text-center">
            Langkah Selanjutnya
          </h2>
          <div className="space-y-3">
            {[
              {
                step: "01",
                text: "Tim kami akan menghubungi via WhatsApp dalam 1×24 jam untuk konfirmasi detail pesanan.",
              },
              {
                step: "02",
                text: "Lakukan pembayaran DP setelah deal (transfer ke rekening yang diberikan tim).",
              },
              {
                step: "03",
                text: "Proses pengerjaan dimulai setelah DP diterima.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <span className="shrink-0 w-7 h-7 rounded-full border border-[#c9a96e]/30 flex items-center justify-center text-[10px] font-mono text-[#c9a96e]">
                  {item.step}
                </span>
                <p className="text-[#8a8a8a] text-sm leading-relaxed pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. CTA Buttons ── */}
        <div className="space-y-3 pt-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 py-4 bg-green-600 text-white text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-green-700 active:bg-green-800 transition-colors rounded-xl"
          >
            <MessageCircle size={16} />
            Chat via WhatsApp Sekarang
          </a>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-4 border border-white/15 text-[#8a8a8a] text-[11px] tracking-[0.18em] uppercase hover:border-white/30 hover:text-[#faf8f5] transition-colors rounded-xl"
          >
            <ArrowLeft size={12} />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-[#4a4a4a] leading-relaxed">
          Ada pertanyaan? Hubungi kami kapan saja di{" "}
          <a href={waLink} className="text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors">
            WhatsApp
          </a>
          .
        </p>
      </div>
    </div>
  );
}

// ── Page component ─────────────────────────────────────────────────────────────
export default function OrderSummaryPage() {
  return (
    <Suspense fallback={<SummarySkeleton />}>
      <SummaryContent />
    </Suspense>
  );
}
