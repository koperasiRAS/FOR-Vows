"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, MessageCircle } from "lucide-react";
import { WA_NUMBER } from "@/lib/config";
import { formatIDR } from "@/lib/utils";
import type { OrderRow } from "@/types";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderCode = searchParams.get("order_id");
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

  if (!orderCode) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-3xl text-[#faf8f5]">Order Tidak Ditemukan</h1>
          <Link href="/" className="text-[#c9a96e] hover:underline text-sm">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="text-[#c9a96e] animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-3xl text-[#faf8f5]">Pesanan Tidak Ditemukan</h1>
          <p className="text-[#6a6a6a] text-sm">
            Kode pesanan tidak valid atau sudah kedaluwarsa.
          </p>
          <Link href="/" className="text-[#c9a96e] hover:underline text-sm">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#6a6a6a] hover:text-[#c9a96e] transition-colors mb-8"
        >
          <ArrowLeft size={12} />
          Kembali ke Beranda
        </Link>

        {/* Card */}
        <div className="bg-[#141414] rounded-2xl border border-white/8 overflow-hidden">
          {/* Header */}
          <div className="text-center px-8 pt-10 pb-8">
            <div className="w-20 h-20 bg-[#c9a96e]/10 border-2 border-[#c9a96e]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-[#c9a96e]" strokeWidth={2.5} />
            </div>
            <h1 className="font-serif text-3xl text-[#faf8f5] mb-2">
              Pesanan Berhasil!
            </h1>
            <p className="text-[#8a8a8a] text-sm leading-relaxed">
              Terima kasih{" "}
              <span className="text-[#faf8f5] font-medium">
                {order.bride_name}
              </span>{" "}
              &amp;{" "}
              <span className="text-[#faf8f5] font-medium">
                {order.groom_name}
              </span>
              !<br />
              Tim kami akan menghubungi kamu dalam 1×24 jam via WhatsApp.
            </p>
          </div>

          {/* Order details */}
          <div className="px-8 pb-8 space-y-4">
            {/* Order code */}
            <div className="bg-[#0a0a0a] rounded-xl p-4 text-center border border-[#c9a96e]/20">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] mb-1">
                Order ID
              </p>
              <p className="font-mono text-lg text-[#c9a96e] tracking-wider">
                {order.order_code}
              </p>
            </div>

            {/* Package & Total */}
            <div className="border border-white/6 divide-y divide-white/5 rounded-xl overflow-hidden">
              {order.package_name && (
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-[11px] tracking-[0.1em] uppercase text-[#6a6a6a]">
                    Paket
                  </span>
                  <span className="text-sm text-[#faf8f5] capitalize">
                    {order.package_name}
                  </span>
                </div>
              )}
              {order.template_name && (
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-[11px] tracking-[0.1em] uppercase text-[#6a6a6a]">
                    Template
                  </span>
                  <span className="text-sm text-[#faf8f5]">
                    {order.template_name}
                  </span>
                </div>
              )}
              {order.final_total != null && (
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-[11px] tracking-[0.1em] uppercase text-[#c9a96e]">
                    Total Bayar
                  </span>
                  <span className="font-serif text-lg text-[#c9a96e]">
                    {formatIDR(order.final_total)}
                  </span>
                </div>
              )}
            </div>

            {/* Payment status */}
            {order.payment_status && (
              <div className="text-center">
                <span
                  className={`inline-block text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full ${
                    order.payment_status === "paid"
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : order.payment_status === "pending"
                      ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                  }`}
                >
                  {order.payment_status === "paid"
                    ? "Sudah Dibayar"
                    : order.payment_status === "pending"
                    ? "Menunggu Pembayaran"
                    : order.payment_status}
                </span>
              </div>
            )}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                `Halo FOR Vows! Saya baru saja memesan undangan digital. Order ID: ${order.order_code}. Terima kasih!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 py-3.5 bg-green-600 text-white text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-green-700 transition-colors rounded-xl"
            >
              <MessageCircle size={15} />
              Hubungi Kami via WhatsApp
            </a>

            {/* Back home */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 py-3.5 border border-white/15 text-[#6a6a6a] text-[11px] tracking-[0.18em] uppercase hover:border-white/30 hover:text-[#8a8a8a] transition-colors rounded-xl"
            >
              <ArrowLeft size={12} />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
          <Loader2 size={24} className="text-[#c9a96e] animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
