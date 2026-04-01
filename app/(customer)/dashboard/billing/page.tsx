import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { BillingClient } from "./BillingClient";

export const metadata: Metadata = {
  title: "Riwayat Pembayaran | FOR Vows",
  description:
    "Lihat semua transaksi dan tagihan pesanan undangan digital pernikahan Anda.",
};

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <Loader2 size={24} className="text-stitch-primary animate-spin" />
        </div>
      }
    >
      <BillingClient />
    </Suspense>
  );
}
