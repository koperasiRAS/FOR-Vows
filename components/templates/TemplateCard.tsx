"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { WeddingTemplate } from "@/types";

interface TemplateCardProps {
  template: WeddingTemplate;
  showActions?: boolean;
}

const categoryKeys: Record<string, "luxury" | "adat" | "modern" | "intimate"> = {
  luxury: "luxury",
  adat: "adat",
  modern: "modern",
  intimate: "intimate",
};

export function TemplateCard({ template, showActions = true }: TemplateCardProps) {
  const { t } = useLanguage();
  const catKey = categoryKeys[template.category] ?? "luxury";
  const categoryLabel = t(`templates.categories.${catKey}` as const);

  return (
    <div className="group bg-[#141414] border border-white/[0.06] hover:border-[#c9a96e]/30 transition-all duration-500 flex flex-col overflow-hidden h-full">
      {/* Cover — links to order, not demo */}
      <Link
        href={`/order?package=premium`}
        className="block relative aspect-[4/3] overflow-hidden shrink-0"
      >
        {/* Image when available, gradient fallback */}
        {template.thumbnailUrl ? (
          <Image
            src={template.thumbnailUrl}
            alt={`${template.name} preview`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${template.gradientFrom} 0%, ${template.gradientTo} 100%)`,
            }}
          />
        )}

        {/* Center ornament (only shown when no image) */}
        {!template.thumbnailUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 border opacity-20 rotate-45"
              style={{ borderColor: template.accentColor }}
            />
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 backdrop-blur-sm"
            style={{
              background: "rgba(0,0,0,0.4)",
              color: template.accentColor,
              border: `1px solid ${template.accentColor}40`,
            }}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Featured badge */}
        {template.featured && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 bg-[#c9a96e] text-[#0a0a0a]">
              {t("ui.featured")}
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1 gap-3 min-h-[140px]">
        <div className="flex-1">
          <h3 className="font-serif text-lg text-[#faf8f5] group-hover:text-[#c9a96e] transition-colors duration-300 leading-snug">
            {template.name}
          </h3>
          <p className="text-xs text-[#6a6a6a] mt-1 leading-relaxed line-clamp-2">
            {template.shortDescription}
          </p>
        </div>

        {showActions && (
          <div className="pt-2">
            <Link
              href={`/order?package=premium`}
              className="flex items-center justify-center gap-1.5 py-2.5 text-[10px] tracking-[0.12em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-all duration-300 w-full"
            >
              <ShoppingCart size={12} />
              {t("ui.order")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
