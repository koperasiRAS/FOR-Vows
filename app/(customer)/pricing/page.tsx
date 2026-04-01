import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PricingCard } from "@/components/pricing/PricingCard";
import { CTASection } from "@/components/sections/CTASection";
import {
  getTranslatedPricingTiers,
  getTranslatedAddOns,
  getTranslatedSaveTheDateTiers,
  getTranslatedWebsiteTiers,
} from "@/lib/templates";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

function PricingSection({
  overline,
  title,
  subtitle,
  tiers,
}: {
  overline: string;
  title: string;
  subtitle?: string;
  tiers: ReturnType<typeof getTranslatedSaveTheDateTiers>;
}) {
  return (
    <div className="mb-20">
      <ScrollReveal>
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">
            {overline}
          </p>
          <h2 className="font-serif text-2xl lg:text-3xl text-[#faf8f5] mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#9a9a9a] max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-4">
        {tiers.map((tier, i) => (
          <ScrollReveal key={tier.name} delay={i * 100}>
            <PricingCard tier={tier} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Harga & Paket Undangan Digital | FOR Vows",
  description: "Pilihan paket undangan pernikahan digital premium: Basic Rp 299.000, Premium Rp 599.000, Exclusive Rp 999.000. Harga transparan, tanpa biaya tersembunyi. FOR Vows.",
  openGraph: {
    title: "Harga & Paket Undangan Digital | FOR Vows",
    description: "Basic Rp 299.000 · Premium Rp 599.000 · Exclusive Rp 999.000",
    url: "https://for-vows.vercel.app/pricing",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default async function PricingPage() {
  const lang = await getServerLanguage();
  const t = translations[lang].pages.pricing;
  const invitationTiers = getTranslatedPricingTiers(lang);
  const saveTheDateTiers = getTranslatedSaveTheDateTiers(lang);
  const websiteTiers = getTranslatedWebsiteTiers(lang);
  const addons = getTranslatedAddOns(lang);

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline={t.overline}
            title={t.title}
            subtitle={t.subtitle}
          />
        </ScrollReveal>
      </div>

      {/* Save the Date */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <PricingSection
          overline={t.saveTheDate.overline}
          title={t.saveTheDate.title}
          subtitle={t.saveTheDate.subtitle}
          tiers={saveTheDateTiers}
        />
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 mb-16">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* Digital Invitation */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <PricingSection
          overline={t.overline}
          title={t.title}
          subtitle={t.subtitle}
          tiers={invitationTiers}
        />
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 mb-16">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* Wedding Website */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <PricingSection
          overline={t.website.overline}
          title={t.website.title}
          subtitle={t.website.subtitle}
          tiers={websiteTiers}
        />
      </div>

      {/* Add-ons */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 mt-20">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">
              {t.enhancePackage}
            </p>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#faf8f5]">
              {t.optionalAddons}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="p-5 border border-white/[0.06] bg-[#0f0f0f] space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-[#faf8f5]">
                    {addon.name}
                  </h4>
                  <span className="text-xs text-[#c9a96e] shrink-0">
                    {addon.price}
                  </span>
                </div>
                <p className="text-xs text-[#6a6a6a] leading-relaxed">
                  {addon.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Note */}
      <ScrollReveal delay={200}>
        <div className="max-w-2xl mx-auto px-6 mt-12 text-center">
          <p className="text-xs text-[#5a5a5a] leading-relaxed">
            {t.priceNote}
          </p>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <CTASection
        overline={t.notSure}
        title={t.findRightTitle}
        subtitle={t.findRightSubtitle}
        primaryCta={{ label: t.bookConsultation, href: "/contact" }}
        secondaryCta={{ label: t.lihatTemplate, href: "/templates" }}
      />
    </div>
  );
}
