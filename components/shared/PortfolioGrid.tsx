"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PortfolioCard } from "@/components/shared/PortfolioCard";
import type { PortfolioItem, TemplateCategory } from "@/types";

const CATEGORIES: Array<TemplateCategory | "all"> = ["all", "luxury", "adat", "modern", "intimate"];

const categoryLabels: Record<string, string> = {
  all: "Semua",
  luxury: "Luxury",
  adat: "Adat",
  modern: "Modern",
  intimate: "Intimate",
};

interface PortfolioClientProps {
  overline: string;
  title: string;
  subtitle: string;
  note: string;
  ctaOverline: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaMulaiLabel: string;
  ctaLihatLabel: string;
  items: PortfolioItem[];
}

export function PortfolioGrid({
  overline,
  title,
  subtitle,
  note,
  ctaOverline,
  ctaTitle,
  ctaSubtitle,
  ctaMulaiLabel,
  ctaLihatLabel,
  items,
}: PortfolioClientProps) {
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-10 text-center">
        <ScrollReveal>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] mb-4">{overline}</h2>
          <h1 className="font-serif text-3xl lg:text-4xl text-[#faf8f5] mb-4">{title}</h1>
          <p className="text-[#6a6a6a] text-sm leading-relaxed max-w-xl mx-auto">{subtitle}</p>
        </ScrollReveal>
      </div>

      {/* Filter Row */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <ScrollReveal>
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 text-xs tracking-widest uppercase rounded-full border transition-all duration-300 ${
                  active === cat
                    ? "bg-[#c9a96e] text-[#0a0a0a] border-[#c9a96e] font-medium"
                    : "border-white/15 text-[#6a6a6a] hover:border-[#c9a96e]/40 hover:text-[#c9a96e]"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 60}>
              <PortfolioCard item={item} />
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6a6a6a] text-sm">Tidak ada portfolio dalam kategori ini.</p>
          </div>
        )}
      </div>

      {/* Note */}
      <ScrollReveal delay={300}>
        <div className="max-w-2xl mx-auto px-6 mt-12 text-center">
          <p className="text-xs text-[#5a5a5a] leading-relaxed">{note}</p>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-6 mt-16 text-center">
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3">{ctaOverline}</p>
          <h2 className="font-serif text-2xl lg:text-3xl text-[#faf8f5] mb-3">{ctaTitle}</h2>
          <p className="text-[#6a6a6a] text-sm mb-8">{ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
            >
              {ctaMulaiLabel}
            </Link>
            <Link
              href="/templates"
              className="px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase border border-white/15 text-[#8a8a8a] hover:border-white/30 transition-colors"
            >
              {ctaLihatLabel}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
