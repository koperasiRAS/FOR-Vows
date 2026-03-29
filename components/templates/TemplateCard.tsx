"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { WeddingTemplate } from "@/types";

const categoryLabels: Record<string, string> = {
  luxury: "Luxury",
  adat: "Adat",
  modern: "Modern",
  intimate: "Intimate",
};

interface TemplateCardProps {
  template: WeddingTemplate;
  showActions?: boolean;
}

export function TemplateCard({ template, showActions = true }: TemplateCardProps) {
  return (
    <div className="group bg-[#141414] border border-white/[0.06] hover:border-[#c9a96e]/30 transition-all duration-500 flex flex-col overflow-hidden">
      {/* Preview */}
      <Link
        href={`/templates/${template.slug}`}
        className="block relative aspect-[4/3] overflow-hidden"
      >
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${template.gradientFrom} 0%, ${template.gradientTo} 100%)`,
          }}
        />
        {/* Center ornament */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 border opacity-20 rotate-45"
            style={{ borderColor: template.accentColor }}
          />
        </div>
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
            {categoryLabels[template.category]}
          </span>
        </div>
        {/* Featured badge */}
        {template.featured && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 bg-[#c9a96e] text-[#0a0a0a]">
              Featured
            </span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-[11px] tracking-[0.15em] uppercase text-white border border-white/40 px-4 py-2 backdrop-blur-sm">
            Preview
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-serif text-lg text-[#faf8f5] group-hover:text-[#c9a96e] transition-colors duration-300">
            {template.name}
          </h3>
          <p className="text-xs text-[#6a6a6a] mt-1 leading-relaxed">
            {template.shortDescription}
          </p>
          <p className="text-xs text-[#c9a96e] mt-1 font-medium">{template.price}</p>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-auto pt-2">
            <Link
              href={`/templates/${template.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] tracking-[0.12em] uppercase border border-white/15 text-[#8a8a8a] hover:border-[#c9a96e]/40 hover:text-[#c9a96e] transition-all duration-300"
            >
              <Eye size={12} />
              Preview
            </Link>
            <AddToCartButton
              item={{
                id: `template-${template.slug}`,
                type: "template",
                name: template.name,
                price: template.price,
                priceValue: parseInt(template.price.replace(/[^\d]/g, "")),
              }}
              label="Pilih"
              className="flex-1"
            />
          </div>
        )}
      </div>
    </div>
  );
}
