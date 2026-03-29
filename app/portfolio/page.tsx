import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PortfolioCard } from "@/components/shared/PortfolioCard";
import { CTASection } from "@/components/sections/CTASection";
import { getTranslatedPortfolioItems } from "@/lib/templates";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

export default async function PortfolioPage() {
  const lang = await getServerLanguage();
  const t = translations[lang].portfolio;
  const items = getTranslatedPortfolioItems(lang);

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline={t.overline}
            title={t.title}
            subtitle={t.subtitle}
          />
        </ScrollReveal>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 60}>
              <PortfolioCard item={item} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Note */}
      <ScrollReveal delay={300}>
        <div className="max-w-2xl mx-auto px-6 mt-12 text-center">
          <p className="text-xs text-[#5a5a5a] leading-relaxed">
            {t.note}
          </p>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <CTASection
        overline={t.ctaOverline}
        title={t.ctaTitle}
        subtitle={t.ctaSubtitle}
        primaryCta={{ label: t.ctaMulai, href: "/contact" }}
        secondaryCta={{ label: t.ctaLihat, href: "/templates" }}
      />
    </div>
  );
}
