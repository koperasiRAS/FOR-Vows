import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { FeatureCard } from "@/components/features/FeatureCard";
import { CTASection } from "@/components/sections/CTASection";
import { getTranslatedFeatures } from "@/lib/templates";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

export const metadata = {
  title: "Fitur Undangan Digital | FOR Vows",
  description: "Fitur lengkap undangan pernikahan digital FOR Vows: RSVP, nama tamu personal, galeri foto, hitung mundur, musik latar, integrasi Google Maps, dan lainnya.",
  openGraph: {
    title: "Fitur Undangan Digital | FOR Vows",
    description: "RSVP, nama tamu personal, galeri foto, musik latar, dan lainnya.",
    url: "https://for-vows.vercel.app/features",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default async function FeaturesPage() {
  const lang = await getServerLanguage();
  const t = translations[lang].features;
  const features = getTranslatedFeatures(lang);

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

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 60}>
              <FeatureCard feature={feature} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Additional Note */}
      <ScrollReveal delay={300}>
        <div className="max-w-2xl mx-auto px-6 mt-16 text-center">
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
        primaryCta={{ label: t.ctaJelajahi, href: "/templates" }}
        secondaryCta={{ label: t.ctaLihatHarga, href: "/pricing" }}
      />
    </div>
  );
}
