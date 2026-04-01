"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { PreviewButton } from "@/components/templates/PreviewButton";
import { getTemplateBySlug, getTranslatedTemplate } from "@/lib/templates";
import { translations, type Language } from "@/lib/i18n/translations";
import { useLanguage } from "@/lib/i18n/context";
import { PACKAGES } from "@/lib/packages";
import type { WeddingTemplate } from "@/types";

interface Props {
  slug: string;
  template: WeddingTemplate;
  related: WeddingTemplate[];
}

export function TemplateDetailClient({ slug, template, related }: Props) {
  const { lang } = useLanguage();
  const t = translations[lang as Language].pages.templates;
  const translated = getTranslatedTemplate(slug, lang);
  const categoryLabel =
    translations[lang as Language].templates.categories[template.category as keyof typeof translations.id.templates.categories];

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Hero Visual Mockup */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-6 pb-8">
        <div className="relative w-full aspect-video lg:aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/6">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, ${template.gradientFrom}ee 0%, ${template.gradientTo}ee 100%)`,
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="w-20 h-20 border opacity-20 rotate-45 mb-4"
              style={{ borderColor: template.accentColor }}
            />
            <p className="font-serif italic text-xl text-white/40">
              {translated?.name ?? template.name}
            </p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mt-2">
              FOR Vows
            </p>
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5"
              style={{
                background: "rgba(0,0,0,0.5)",
                color: template.accentColor,
                border: `1px solid ${template.accentColor}50`,
              }}
            >
              {categoryLabel}
            </span>
            {template.featured && (
              <span className="text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 bg-[#c9a96e] text-[#0a0a0a]">
                Featured
              </span>
            )}
          </div>
          {/* TODO: Add hero image at public/images/templates/[slug]/hero.jpg */}
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-6">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#6a6a6a] hover:text-[#c9a96e] transition-colors"
        >
          <ArrowLeft size={12} />
          {t.backToAll}
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          {/* Preview Panel */}
          <ScrollReveal>
            <div className="space-y-6">
              {/* Main preview */}
              <div className="relative aspect-[4/3] overflow-hidden border border-white/6">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(160deg, ${template.gradientFrom} 0%, ${template.gradientTo} 100%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-24 h-24 border opacity-20 rotate-45"
                    style={{ borderColor: template.accentColor }}
                  />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <p className="font-serif italic text-2xl text-white/60">
                    {translated?.name ?? template.name}
                  </p>
                  <div
                    className="w-12 h-px"
                    style={{ background: template.accentColor + "60" }}
                  />
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">
                    FOR Vows Preview
                  </p>
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="aspect-[4/3] border border-white/6 overflow-hidden"
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(135deg, ${template.gradientFrom}cc 0%, ${template.gradientTo}cc 100%)`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Preview CTA */}
              <div className="space-y-4">
                <Link
                  href={`/demo/${template.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-4 text-[11px] tracking-[0.18em] uppercase
                    bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-all duration-300"
                >
                  Preview Langsung →
                </Link>
                <div className="flex items-center justify-center gap-6 py-3">
                  <div className="flex items-center gap-2 text-[#4a4a4a]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <line x1="12" y1="18" x2="12" y2="18" />
                    </svg>
                    <span className="text-[10px] tracking-wide">Mobile</span>
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-2 text-[#4a4a4a]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    <span className="text-[10px] tracking-wide">Desktop</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Info Panel */}
          <ScrollReveal delay={150}>
            <div className="space-y-6 lg:sticky lg:top-28">
              <div>
                <span
                  className="text-[10px] tracking-[0.2em] uppercase px-3 py-1 border"
                  style={{
                    color: template.accentColor,
                    borderColor: template.accentColor + "40",
                    background: template.accentColor + "10",
                  }}
                >
                  {categoryLabel}
                </span>
              </div>

              <div>
                <h1 className="font-serif text-3xl lg:text-4xl text-[#faf8f5] leading-tight">
                  {translated?.name ?? template.name}
                </h1>
                <p className="text-sm text-[#6a6a6a] mt-2">
                  {translated?.shortDescription ?? template.shortDescription}
                </p>
              </div>

              <div className="h-px bg-white/6" />

              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">{t.description}</p>
                <p className="text-sm text-[#8a8a8a] leading-relaxed">
                  {translated?.description ?? template.description}
                </p>
              </div>

              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">{t.suitableFor}</p>
                <div className="flex flex-wrap gap-2">
                  {(translated?.suitableFor ?? template.suitableFor).map((s) => (
                    <span key={s} className="text-xs text-[#6a6a6a] border border-white/8 px-3 py-1">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">{t.includedFeatures}</p>
                <ul className="space-y-2">
                  {(translated?.features ?? template.features).map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check size={12} className="text-[#c9a96e] shrink-0" />
                      <span className="text-xs text-[#8a8a8a]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-white/6" />

              <div className="space-y-3">
                <Link
                  href={`/order?template=${template.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-[11px] tracking-[0.18em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-all duration-300"
                >
                  {lang === "id" ? "Pilih Paket & Pesan" : "Choose Package & Order"}
                  <ArrowRight size={14} />
                </Link>
                <PreviewButton template={template} translatedName={translated?.name} />
              </div>

              <div className="p-4 border border-white/6 space-y-2">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-3">
                  {lang === "id" ? "Pilihan Paket" : "Package Options"}
                </p>
                {PACKAGES.map((pkg) => (
                  <div key={pkg.key} className="flex items-center justify-between">
                    <span className="text-xs text-[#8a8a8a]">{pkg.label}</span>
                    <span className="text-xs text-[#c9a96e]">{pkg.priceLabel}</span>
                  </div>
                ))}
                <Link
                  href="/pricing"
                  className="block text-center text-[10px] text-[#6a6a6a] hover:text-[#c9a96e] transition-colors mt-1 tracking-wide"
                >
                  {lang === "id" ? "Lihat detail semua paket →" : "View all packages →"}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Device Mockup — Tampilan di Semua Perangkat */}
        <section className="mt-16 pt-10 border-t border-white/6 space-y-8">
          <div className="text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] mb-2">
              {lang === "id" ? "Pratinjau" : "Preview"}
            </p>
            <h2 className="font-serif text-2xl text-[#faf8f5]">
              {lang === "id" ? "Tampilan di Semua Perangkat" : "Looks Great on Every Device"}
            </h2>
            <p className="text-sm text-[#6a6a6a] mt-2 max-w-md mx-auto">
              {lang === "id"
                ? "Undangan Anda akan tampil sempurna di smartphone, tablet, dan desktop."
                : "Your invitation looks beautiful on smartphones, tablets, and desktops."}
            </p>
          </div>

          {/* Device mockups */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Mobile mockup */}
            <div className="flex flex-col items-center gap-3">
              {/* Phone chrome */}
              <div className="relative w-[180px] h-[370px] rounded-[2rem] p-1.5 bg-[#1a1a1a] shadow-2xl ring-1 ring-white/10">
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#0a0a0a] rounded-full z-10" />
                {/* Screen */}
                <div className="relative w-full h-full rounded-[1.6rem] overflow-hidden bg-[#0d0d0d]">
                  <Image
                    src={`/images/templates/${slug}/mobile-preview.jpg`}
                    alt="Mobile preview"
                    fill
                    className="object-cover object-top"
                    sizes="180px"
                    onError={(e) => {
                      // Graceful fallback to gradient
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  {/* Gradient fallback shown when image missing */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(160deg, ${template.gradientFrom}dd 0%, ${template.gradientTo}dd 100%)`,
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#4a4a4a]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18" />
                </svg>
                <span className="text-[10px] tracking-wide">Mobile</span>
              </div>
            </div>

            {/* Tablet mockup */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-[280px] h-[200px] rounded-xl p-1.5 bg-[#1a1a1a] shadow-2xl ring-1 ring-white/10">
                {/* Stand */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-3 bg-[#1a1a1a] rounded-b-md" />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#141414] rounded-b-lg" />
                {/* Screen */}
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0d0d0d]">
                  <Image
                    src={`/images/templates/${slug}/desktop-preview.jpg`}
                    alt="Desktop preview"
                    fill
                    className="object-cover object-top"
                    sizes="280px"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(160deg, ${template.gradientFrom}cc 0%, ${template.gradientTo}cc 100%)`,
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#4a4a4a]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span className="text-[10px] tracking-wide">Desktop</span>
              </div>
            </div>
          </div>

          {/* Screenshot gallery */}
          <div className="space-y-3">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#4a4a4a] text-center">
              {lang === "id" ? "Galeri Screenshot" : "Screenshot Gallery"}
            </p>
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {(["hero", "details", "countdown", "rsvp", "gallery"] as const).map((section) => (
                <div
                  key={section}
                  className="flex-shrink-0 snap-start w-36 aspect-[9/16] rounded-lg overflow-hidden border border-white/6 bg-[#0d0d0d] relative"
                >
                  <Image
                    src={`/images/templates/${slug}/section-${section}.jpg`}
                    alt={`${section} section preview`}
                    fill
                    className="object-cover"
                    sizes="144px"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(160deg, ${template.gradientFrom}88 0%, ${template.gradientTo}88 100%)`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA to live demo */}
          <div className="text-center">
            <Link
              href={`/demo/${template.slug}`}
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#c9a96e] hover:text-[#d4b87a] border border-[#c9a96e]/30 hover:border-[#c9a96e]/60 px-6 py-3 transition-all"
            >
              {lang === "id" ? "Buka Demo Interaktif →" : "Open Interactive Demo →"}
            </Link>
          </div>
        </section>

        {/* Related Templates */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/6">
            <ScrollReveal>
              <SectionHeading overline={t.youMayAlsoLike} title={t.relatedTemplates} />
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {related.map((t, i) => (
                <ScrollReveal key={t.id} delay={i * 80}>
                  <TemplateCard template={t} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
