"use client";

import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface PreviewButtonProps {
  templateName: string;
}

export function PreviewButton({ templateName }: PreviewButtonProps) {
  const { t } = useLanguage();

  return (
    <button
      className="flex items-center justify-center gap-2 w-full py-3.5 text-[11px] tracking-[0.18em] uppercase border border-white/15 text-[#faf8f5] hover:border-white/30 hover:bg-white/5 transition-all duration-300"
      onClick={() =>
        alert(t("preview.comingSoon", { name: templateName }))
      }
    >
      <ExternalLink size={13} />
      {t("preview.previewLiveDemo")}
    </button>
  );
}
