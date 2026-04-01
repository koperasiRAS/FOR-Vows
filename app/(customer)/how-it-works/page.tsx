import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { HowItWorksStep } from "@/components/shared/HowItWorksStep";
import { CTASection } from "@/components/sections/CTASection";
import { getTranslatedHowItWorksSteps } from "@/lib/templates";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

export const metadata = {
  title: "Cara Pesan Undangan | FOR Vows",
  description: "5 langkah mudah pesan undangan pernikahan digital di FOR Vows. Pilih template, kirim detail, review & setuju, lakukan pembayaran, dan publikasi.",
  openGraph: {
    title: "Cara Pesan Undangan | FOR Vows",
    description: "5 langkah mudah pesan undangan pernikahan digital premium.",
    url: "https://for-vows.vercel.app/how-it-works",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default async function HowItWorksPage() {
  const lang = await getServerLanguage();
  const t = translations[lang].pages.howItWorks;
  const steps = getTranslatedHowItWorksSteps(lang);

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline={t.overline}
            title={t.title}
            subtitle={t.subtitle}
          />
        </ScrollReveal>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="border-l border-[#c9a96e]/10 pl-8 lg:pl-12">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 100}>
              <HowItWorksStep step={step} last={i === steps.length - 1} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Timeline note */}
      <ScrollReveal delay={500}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 mt-12">
          <div className="p-6 border border-white/[0.06] bg-[#0f0f0f] grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center space-y-1">
              <p className="font-serif text-2xl text-[#c9a96e]">5–7</p>
              <p className="text-xs text-[#6a6a6a]">{t.daysNote}</p>
            </div>
            <div className="text-center space-y-1 border-x border-white/[0.06]">
              <p className="font-serif text-2xl text-[#c9a96e]">1</p>
              <p className="text-xs text-[#6a6a6a]">{t.revisionsNote}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="font-serif text-2xl text-[#c9a96e]">48h</p>
              <p className="text-xs text-[#6a6a6a]">{t.rushNote}</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <CTASection
        overline={t.readyToStart}
        title={t.fiveStepsTitle}
        subtitle={t.fiveStepsSubtitle}
        primaryCta={{ label: t.lihatTemplate, href: "/templates" }}
        secondaryCta={{ label: t.hubungiKami, href: "/contact" }}
      />
    </div>
  );
}
