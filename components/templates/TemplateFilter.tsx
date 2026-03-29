"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import type { TemplateCategory } from "@/types";

const categoryKeys = [
  { value: "all" as const, key: "templateFilter.semuaTemplate" },
  { value: "luxury" as const, key: "templateFilter.luxury" },
  { value: "adat" as const, key: "templateFilter.adat" },
  { value: "modern" as const, key: "templateFilter.modern" },
  { value: "intimate" as const, key: "templateFilter.intimate" },
];

interface TemplateFilterProps {
  active: TemplateCategory | "all";
  onChange: (category: TemplateCategory | "all") => void;
}

export function TemplateFilter({ active, onChange }: TemplateFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categoryKeys.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={cn(
            "px-5 py-2 text-[11px] tracking-[0.15em] uppercase border transition-all duration-300",
            active === cat.value
              ? "bg-[#c9a96e] border-[#c9a96e] text-[#0a0a0a]"
              : "border-white/15 text-[#8a8a8a] hover:border-[#c9a96e]/50 hover:text-[#c9a96e]"
          )}
        >
          {t(cat.key)}
        </button>
      ))}
    </div>
  );
}
