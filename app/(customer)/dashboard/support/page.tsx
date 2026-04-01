import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SupportClient } from "./SupportClient";

export const metadata: Metadata = {
  title: "Bantuan & Dukungan | FOR Vows",
  description:
    "Temukan jawaban atas pertanyaan umum atau hubungi tim FOR Vows langsung via WhatsApp dan email.",
};

export default function SupportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <Loader2 size={24} className="text-stitch-primary animate-spin" />
        </div>
      }
    >
      <SupportClient />
    </Suspense>
  );
}
