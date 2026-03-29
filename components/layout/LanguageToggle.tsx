"use client";

import { useLanguage } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "id" ? "en" : "id")}
      className="text-[11px] tracking-wider uppercase font-medium text-[#c9a96e] hover:text-[#d4b87a] transition-colors border border-[#c9a96e]/30 hover:border-[#c9a96e]/60 px-2.5 py-1"
      aria-label={
        lang === "id" ? t("langToggle.switchToEn") : t("langToggle.switchToId")
      }
      title={
        lang === "id" ? t("langToggle.switchToEn") : t("langToggle.switchToId")
      }
    >
      {lang === "id" ? "EN" : "ID"}
    </button>
  );
}
