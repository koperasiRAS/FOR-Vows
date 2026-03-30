"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";
import { WA_NUMBER } from "@/lib/config";
import type { OrderRow } from "@/types";

const STATUS_LABELS_ID: Record<string, string> = {
  pending: "Menunggu",
  waiting_payment: "Menunggu Pembayaran",
  paid: "Sudah Bayar",
  in_progress: "Sedang Dikerjakan",
  revision: "Revisi",
  completed: "Selesai",
};

const STATUS_LABELS_EN: Record<string, string> = {
  pending: "Pending",
  waiting_payment: "Waiting Payment",
  paid: "Paid",
  in_progress: "In Progress",
  revision: "Revision",
  completed: "Completed",
};

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#c9a96e]/20 border-t-[#c9a96e] rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("code");
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

  const statusLabels = lang === "id" ? STATUS_LABELS_ID : STATUS_LABELS_EN;

  const waMessage = orderCode
    ? `Halo FOR Vows! Saya sudah membuat pesanan dengan kode ${orderCode}. Mohon info lebih lanjut untuk pembayaran. Terima kasih! 🙏`
    : "";
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        {/* Back link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-[#6a6a6a] hover:text-[#c9a96e] transition-colors mb-8 tracking-wide"
        >
          <ArrowLeft size={14} />
          {lang === "id" ? "Kembali ke Beranda" : "Back to Home"}
        </Link>

        {loading && (
          <div className="flex flex-col items-center text-center gap-4 py-20">
            <div className="w-16 h-16 border-2 border-[#c9a96e]/20 border-t-[#c9a96e] rounded-full animate-spin" />
            <p className="text-[#6a6a6a] text-sm">{lang === "id" ? "Memuat..." : "Loading..."}</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <h1 className="font-serif text-3xl text-[#faf8f5] mb-3">
              {lang === "id" ? "Pesanan Tidak Ditemukan" : "Order Not Found"}
            </h1>
            <p className="text-[#6a6a6a] text-sm mb-6">
              {lang === "id"
                ? "Kode pesanan tidak valid atau sudah kedaluwarsa."
                : "Order code is invalid or has expired."}
            </p>
            <Link
              href="/templates"
              className="inline-block px-8 py-3.5 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
            >
              {lang === "id" ? "Lihat Template" : "View Templates"}
            </Link>
          </div>
        )}

        {!loading && order && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center">
                <Check size={28} className="text-[#c9a96e]" />
              </div>
              <h1 className="font-serif text-3xl text-[#faf8f5]">
                {t("orderSuccess.title")}
              </h1>
              <p className="text-[#8a8a8a] text-sm max-w-sm">
                {t("orderSuccess.subtitle")}
              </p>
            </div>

            {/* Order Code */}
            <div className="p-5 border border-[#c9a96e]/20 bg-[#c9a96e]/5 text-center">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] mb-2">
                {t("orderSuccess.orderCode")}
              </p>
              <p className="font-mono text-2xl text-[#c9a96e] tracking-wider">
                {order.order_code}
              </p>
            </div>

            {/* Order Details */}
            <div className="border border-white/[0.06] divide-y divide-white/[0.05]">
              <div className="px-5 py-4">
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#6a6a6a] mb-1">
                  {lang === "id" ? "Mempelai" : "Couple"}
                </p>
                <p className="text-[#faf8f5]">
                  {order.groom_name} & {order.bride_name}
                </p>
              </div>

              {order.template && (
                <div className="px-5 py-4">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#6a6a6a] mb-1">
                    {t("orderSuccess.template")}
                  </p>
                  <p className="text-[#faf8f5]">{order.template}</p>
                </div>
              )}

              {order.package_name && (
                <div className="px-5 py-4">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#6a6a6a] mb-1">
                    {t("orderSuccess.package")}
                  </p>
                  <p className="text-[#c9a96e] capitalize">
                    {order.package_name}
                  </p>
                </div>
              )}

              <div className="px-5 py-4">
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#6a6a6a] mb-1">
                  {lang === "id" ? "Status" : "Status"}
                </p>
                <span className="inline-block px-3 py-1 bg-[#c9a96e]/10 border border-[#c9a96e]/30 text-[#c9a96e] text-xs tracking-wider">
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>
            </div>

            {/* WhatsApp Validation Note */}
            <div className="p-4 border border-[#c9a96e]/20 bg-[#c9a96e]/5">
              <p className="text-xs text-[#8a8a8a] leading-relaxed mb-3">
                {t("orderSuccess.validationNote")}
              </p>
              <WhatsAppButton
                as="a"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                label={t("orderSuccess.contactAdmin")}
                className="py-3.5 w-full"
              />
            </div>

            {/* Next Steps */}
            <div className="p-4 border border-white/[0.05] bg-[#0f0f0f]">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#8a8a8a] mb-3">
                {t("orderSuccess.nextSteps")}
              </p>
              <ol className="space-y-2 text-xs text-[#6a6a6a] list-decimal list-inside">
                <li>{t("orderSuccess.step1")}</li>
                <li>{t("orderSuccess.step2")}</li>
                <li>{t("orderSuccess.step3")}</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <WhatsAppButton
                as="a"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                label={t("orderSuccess.contactAdmin")}
                className="py-3.5 flex-1"
              />
              <Link
                href="/templates"
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 text-[11px] tracking-widest uppercase border border-white/15 text-[#8a8a8a] hover:border-white/30 hover:text-[#faf8f5] transition-colors"
              >
                {t("orderSuccess.viewTemplates")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
