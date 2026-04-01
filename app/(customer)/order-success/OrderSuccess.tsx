"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/context";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { OrderRow } from "@/types";
import { formatIDR } from "@/lib/utils";
import { WA_NUMBER } from "@/lib/config";
import { getSnapToken, openSnapPopup } from "@/lib/midtrans";
import { createClient } from "@/lib/supabase/client";

function OrderSuccessContent() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("code");
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [paying, setPaying] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchOrder = useCallback(() => {
    if (!orderCode) return;
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

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!orderCode) {
      setLoading(false);
      return;
    }
    fetchOrder();
  }, [orderCode, fetchOrder]);

  const handlePayNow = async () => {
    if (!order) return;
    setPaying(true);
    try {
      const customerName = `${order.groom_name} & ${order.bride_name}`;
      const tokenData = await getSnapToken({
        bookingId: order.order_code,
        customerName,
        customerPhone: order.phone,
        userId: userId ?? undefined,
        items:
          (order.items as Array<{ name: string; priceValue?: number; price?: number; quantity: number }> | null)
            ?.map((item) => ({
              name: item.name,
              price: item.priceValue ?? item.price ?? 0,
              quantity: item.quantity ?? 1,
            })) ?? [],
      });
      await openSnapPopup(tokenData.token);
      let settled = false;
      for (let i = 0; i < 3; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        const res = await fetch(`/api/orders?orderCode=${encodeURIComponent(order.order_code)}`);
        const data = await res.json();
        if (data.order?.status === "paid") {
          settled = true;
          break;
        }
      }
      if (settled) {
        toast.success(
          lang === "id"
            ? "Pembayaran berhasil! Mengalihkan ke dashboard..."
            : "Payment successful! Redirecting to dashboard..."
        );
        await new Promise((r) => setTimeout(r, 1500));
        router.push("/dashboard?payment=success");
      } else {
        toast.warning(
          lang === "id"
            ? "Pembayaran belum dikonfirmasi. Cek status di dashboard."
            : "Payment not yet confirmed. Check your dashboard for updates."
        );
        fetchOrder();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Pembayaran gagal";
      if (!msg.includes("popup") && !msg.includes("ditutup")) {
        toast.error(msg);
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-[#6a6a6a] hover:text-[#c9a96e] transition-colors mb-8 tracking-wide"
        >
          <ArrowLeft size={14} />
          {lang === "id" ? "Kembali ke Beranda" : "Back to Home"}
        </Link>

        {!orderCode && (
          <div className="text-center py-20 space-y-4">
            <h1 className="font-serif text-3xl text-[#faf8f5]">
              {lang === "id" ? "Order Tidak Ditemukan" : "Order Not Found"}
            </h1>
            <p className="text-[#6a6a6a] text-sm">
              {lang === "id"
                ? "Parameter kode pesanan tidak ditemukan."
                : "Order code parameter not found."}
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3.5 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
            >
              {lang === "id" ? "Kembali ke Beranda" : "Back to Home"}
            </Link>
          </div>
        )}

        {orderCode && loading && (
          <div className="flex flex-col items-center text-center gap-4 py-20">
            <Loader2 size={24} className="text-[#c9a96e] animate-spin" />
            <p className="text-[#6a6a6a] text-sm">{lang === "id" ? "Memuat..." : "Loading..."}</p>
          </div>
        )}

        {orderCode && !loading && error && (
          <div className="text-center py-20 space-y-4">
            <h1 className="font-serif text-3xl text-[#faf8f5]">
              {lang === "id" ? "Pesanan Tidak Ditemukan" : "Order Not Found"}
            </h1>
            <p className="text-[#6a6a6a] text-sm">
              {lang === "id"
                ? "Kode pesanan tidak valid atau sudah kedaluwarsa."
                : "Order code is invalid or has expired."}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3.5 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
              >
                {lang === "id" ? "Kembali ke Dashboard" : "Back to Dashboard"}
              </Link>
              <Link
                href="/templates"
                className="inline-block px-8 py-3.5 text-[11px] tracking-widest uppercase border border-[#c9a96e] text-[#c9a96e] font-medium hover:bg-[#c9a96e]/10 transition-colors"
              >
                {lang === "id" ? "Lihat Template" : "View Templates"}
              </Link>
            </div>
          </div>
        )}

        {orderCode && !loading && order && (
          <div className="space-y-5">
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

            <div className="p-5 border border-[#c9a96e]/20 bg-[#c9a96e]/5 text-center">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] mb-2">
                {t("orderSuccess.orderCode")}
              </p>
              <p className="font-mono text-2xl text-[#c9a96e] tracking-wider">
                {order.order_code}
              </p>
            </div>

            <div className="border border-white/6 divide-y divide-white/5">
              <div className="px-5 py-4">
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#6a6a6a] mb-1">
                  {lang === "id" ? "Mempelai" : "Couple"}
                </p>
                <p className="text-[#faf8f5]">
                  {order.groom_name} & {order.bride_name}
                </p>
              </div>
              {order.package_name && (
                <div className="px-5 py-4">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#6a6a6a] mb-1">
                    {t("orderSuccess.package")}
                  </p>
                  <p className="text-[#c9a96e] capitalize">{order.package_name}</p>
                </div>
              )}
              {order.template && (
                <div className="px-5 py-4">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#6a6a6a] mb-1">
                    {t("orderSuccess.template")}
                  </p>
                  <p className="text-[#faf8f5]">{order.template}</p>
                </div>
              )}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#6a6a6a] mb-0.5">{lang === "id" ? "Status" : "Status"}</p>
                    <StatusBadge status={order.status} lang={lang} size="sm" />
                  </div>
                  {order.final_total != null && (
                    <div className="text-right">
                      <p className="text-[10px] text-[#6a6a6a] mb-0.5">{lang === "id" ? "Total" : "Total"}</p>
                      <p className="font-serif text-lg text-[#faf8f5]">
                        {formatIDR(order.final_total)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {order.status === "pending" && (
              <div className="p-5 border border-[#c9a96e]/30 bg-[#c9a96e]/5 space-y-3">
                <p className="text-xs text-[#8a8a8a] text-center">
                  {lang === "id"
                    ? "Selesaikan pembayaran untuk memproses pesanan Anda."
                    : "Complete your payment to process your order."}
                </p>
                <button
                  onClick={handlePayNow}
                  disabled={paying}
                  className="w-full py-4 flex items-center justify-center gap-2 bg-[#c9a96e] text-[#0a0a0a] text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-[#d4b87a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {paying ? (
                    <><Loader2 size={14} className="animate-spin" />{lang === "id" ? "Membuka pembayaran..." : "Opening payment..."}</>
                  ) : (
                    <>{lang === "id" ? "Bayar Sekarang via Midtrans" : "Pay Now via Midtrans"}</>
                  )}
                </button>
                <p className="text-center text-[10px] text-[#6a6a6a]">
                  🔒 {lang === "id" ? "Pembayaran aman via Midtrans" : "Secure payment via Midtrans"}
                </p>
              </div>
            )}

            {(order.status === "cancelled" || order.payment_status === "expired") && (
              <div className="p-5 border border-red-500/30 bg-red-500/5 space-y-3 text-center">
                <p className="text-sm text-red-400">
                  {lang === "id"
                    ? "Waktu pembayaran sebelumnya telah habis atau gagal."
                    : "Previous payment window expired or failed."}
                </p>
                <button
                  onClick={handlePayNow}
                  disabled={paying}
                  className="w-full py-4 flex items-center justify-center gap-2 border border-red-500/30 text-red-200 text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {paying ? <Loader2 size={14} className="animate-spin" /> : null}
                  {lang === "id" ? "Generate New Payment" : "Generate New Payment"}
                </button>
              </div>
            )}

            {(order.status === "paid" || order.status === "processing") && (
              <div className="p-5 border border-green-500/20 bg-green-500/5 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 text-[10px] tracking-widest uppercase mb-2">
                  <Check size={12} />
                  Already Paid
                </div>
                <p className="text-sm text-[#faf8f5]">
                  {lang === "id"
                    ? "Pembayaran sudah diterima. Pesanan Anda sedang diproses!"
                    : "Payment received. Your order is being processed!"}
                </p>
                <p className="text-xs text-[#6a6a6a]">
                  {lang === "id"
                    ? "Tim kami akan menghubungi Anda via WhatsApp."
                    : "Our team will contact you via WhatsApp."}
                </p>
              </div>
            )}

            {order.status === "completed" && (
              <div className="p-5 border border-green-500/20 bg-green-500/5 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 text-[10px] tracking-widest uppercase mb-2">
                  <Check size={12} />
                  Completed
                </div>
                <p className="text-sm text-[#faf8f5]">
                  {lang === "id"
                    ? "Pesanan selesai! Undangan digital Anda siap."
                    : "Order completed! Your digital invitation is ready."}
                </p>
              </div>
            )}

            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                `Halo FOR Vows! Saya sudah membuat pesanan ${order.order_code}. Ada yang perlu saya tanyakan. Terima kasih! 🙏`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 text-center text-[11px] tracking-widest uppercase border border-white/15 text-[#8a8a8a] hover:border-white/30 hover:text-[#faf8f5] transition-all"
            >
              {lang === "id" ? "Hubungi Support via WhatsApp" : "Contact Support via WhatsApp"}
            </a>

            <div className="p-4 border border-white/5 bg-[#0f0f0f] space-y-2">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#8a8a8a] mb-2">
                {t("orderSuccess.nextSteps")}
              </p>
              <ol className="space-y-2 text-xs text-[#6a6a6a] list-decimal list-inside">
                <li>{t("orderSuccess.step1")}</li>
                <li>{t("orderSuccess.step2")}</li>
                <li>{t("orderSuccess.step3")}</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 text-[11px] tracking-widest uppercase border border-white/15 text-[#8a8a8a] hover:border-white/30 hover:text-[#faf8f5] transition-colors"
              >
                {lang === "id" ? "Lacak Pesanan" : "Track Order"}
              </Link>
              <Link
                href="/templates"
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 text-[11px] tracking-widest uppercase border border-white/15 text-[#8a8a8a] hover:border-white/30 hover:text-[#faf8f5] transition-colors"
              >
                {lang === "id" ? "Lihat Template" : "View Templates"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function OrderSuccessClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <Loader2 size={24} className="text-[#c9a96e] animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
