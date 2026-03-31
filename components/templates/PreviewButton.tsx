"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { WeddingTemplate } from "@/types";

interface PreviewButtonProps {
  template: WeddingTemplate;
  translatedName?: string;
}

export function PreviewButton({ template }: PreviewButtonProps) {
  const { t } = useLanguage();

  return (
    <Link
      href={`/demo/${template.slug}`}
      className="flex items-center justify-center gap-2 w-full py-3.5 text-[11px] tracking-[0.18em] uppercase border border-white/15 text-[#faf8f5] hover:border-white/30 hover:bg-white/5 transition-all duration-300"
    >
      <ExternalLink size={13} />
      {t("preview.previewLiveDemo")}
    </Link>
  );
}
