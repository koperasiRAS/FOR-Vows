import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | FOR Vows",
  description:
    "Kelola undangan pernikahan digital Anda — lacak pesanan, lihat tagihan, dan akses dukungan.",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <Loader2 size={24} className="text-stitch-primary animate-spin" />
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
