import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderDetailClient } from "./OrderDetailClient";

export const metadata: Metadata = {
  title: "Detail Pesanan | FOR Vows",
  description:
    "Lihat detail dan status pesanan Undangan digital pernikahan Anda.",
};

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-stitch-primary-container/30 border-t-stitch-primary rounded-full animate-spin" />
        </div>
      }
    >
      <OrderDetailClient />
    </Suspense>
  );
}
