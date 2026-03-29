"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-4">
        {t("notFound.title404")}
      </p>
      <h1 className="font-serif text-4xl lg:text-5xl text-[#faf8f5] mb-4">
        {t("notFound.pageNotFound")}
      </h1>
      <p className="text-sm text-[#8a8a8a] max-w-md mb-8 leading-relaxed">
        {t("notFound.notFoundDesc")}
      </p>
      <Link
        href="/"
        className="px-8 py-3 text-[11px] tracking-[0.2em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
      >
        {t("notFound.kembaliBeranda")}
      </Link>
    </div>
  );
}
