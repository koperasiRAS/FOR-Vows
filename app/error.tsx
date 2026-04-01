"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service if needed
    console.error("[FOR Vows] Client error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-6">
        {/* Decorative ornament */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-px bg-[#c9a96e]/20" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#c9a96e]/40">
            FOR Vows
          </span>
          <div className="w-12 h-px bg-[#c9a96e]/20" />
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-4">
            Oops
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-[#faf8f5] mb-4">
            Terjadi Kesalahan
          </h1>
          <p className="text-sm text-[#6a6a6a] leading-relaxed">
            Maaf, sesuatu tidak berjalan sesuai rencana. Silakan coba lagi atau
            kembali ke halaman utama.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3.5 text-[11px] tracking-[0.18em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="px-8 py-3.5 text-[11px] tracking-[0.18em] uppercase border border-white/20 text-[#faf8f5] hover:border-white/40 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>

        {error.digest && (
          <p className="text-[10px] text-[#4a4a4a] font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
