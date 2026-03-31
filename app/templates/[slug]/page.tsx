"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { PreviewButton } from "@/components/templates/PreviewButton";
import { getTemplateBySlug, getRelatedTemplates, getTranslatedTemplate } from "@/lib/templates";
import { translations, type Language } from "@/lib/i18n/translations";
import { useLanguage } from "@/lib/i18n/context";
import { PACKAGES } from "@/lib/packages";

import { use } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function TemplateDetailPage({ params }: Props) {
  const { slug } = use(params);
  const { lang } = useLanguage();
  const t = translations[lang as Language].pages.templates;

  const template = getTemplateBySlug(slug);
  if (!template) {
    notFound();
  }

  const translated = getTranslatedTemplate(slug, lang);
  const related = getRelatedTemplates(slug, template.category, 3, lang);
  const categoryLabel = translations[lang as Language].templates.categories[template.category as keyof typeof translations.id.templates.categories];

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-8 pb-6">
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
                {/* Overlay ornament */}
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
            </div>
          </ScrollReveal>

          {/* Info Panel */}
          <ScrollReveal delay={150}>
            <div className="space-y-6 lg:sticky lg:top-28">
              {/* Category badge */}
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
                <p className="text-sm text-[#6a6a6a] mt-2">{translated?.shortDescription ?? template.shortDescription}</p>
              </div>

              <div className="h-px bg-white/6" />

              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">
                  {t.description}
                </p>
                <p className="text-sm text-[#8a8a8a] leading-relaxed">
                  {translated?.description ?? template.description}
                </p>
              </div>

              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">
                  {t.suitableFor}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(translated?.suitableFor ?? template.suitableFor).map((s) => (
                    <span
                      key={s}
                      className="text-xs text-[#6a6a6a] border border-white/8 px-3 py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">
                  {t.includedFeatures}
                </p>
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

              {/* CTAs */}
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

              {/* Package quick reference */}
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

        {/* Related Templates */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/6">
            <ScrollReveal>
              <SectionHeading
                overline={t.youMayAlsoLike}
                title={t.relatedTemplates}
              />
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
