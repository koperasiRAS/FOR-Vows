"use client";

import { cn } from "@/lib/utils";
import type { TemplateCategory } from "@/types";

const categories: { value: TemplateCategory | "all"; label: string }[] = [
  { value: "all", label: "All Templates" },
  { value: "luxury", label: "Luxury" },
  { value: "adat", label: "Adat" },
  { value: "modern", label: "Modern" },
  { value: "intimate", label: "Intimate" },
];

interface TemplateFilterProps {
  active: TemplateCategory | "all";
  onChange: (category: TemplateCategory | "all") => void;
}

export function TemplateFilter({ active, onChange }: TemplateFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
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
          {cat.label}
        </button>
      ))}
    </div>
  );
}
