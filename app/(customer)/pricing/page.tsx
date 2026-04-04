import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PricingCard } from "@/components/pricing/PricingCard";
import { CTASection } from "@/components/sections/CTASection";
import { WeddingPhotographySection } from "@/components/sections/WeddingPhotographySection";
import { WeddingContentCreatorSection } from "@/components/sections/WeddingContentCreatorSection";
import { WeddingSouvenirSection } from "@/components/sections/WeddingSouvenirSection";
import {
  DIGITAL_INVITATION,
  WEDDING_PHOTOGRAPHY,
  CONTENT_CREATOR,
  SOUVENIR_DESIGN,
  formatPriceRange,
} from "@/lib/constants/services";
import {
  getTranslatedPricingTiers,
  getTranslatedAddOns,
  getTranslatedSaveTheDateTiers,
  getTranslatedWebsiteTiers,
} from "@/lib/templates";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "Harga & Paket Lengkap | FOR Vows — Undangan Digital, Foto Video, Content Creator",
  description:
    "Harga undangan digital, foto & video, wedding content creator, dan souvenir. Paket lengkap Rp99.000–Rp3.000.000. Harga transparan, tanpa biaya tersembunyi. FOR Vows.",
  keywords: [
    "harga undangan digital",
    "paket foto video wedding",
    "harga wedding content creator",
    "desain souvenir pernikahan",
    "harga pernikahan lengkap",
    "undangan digital murah",
    "fotografer pernikahan harga",
    "for vows pricing",
  ],
  openGraph: {
    title: "Harga & Paket Lengkap | FOR Vows",
    description: "Undangan digital, foto & video, content creator, souvenir — semua dari satu studio kreatif dengan harga transparan.",
    url: "https://for-vows.vercel.app/pricing",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

// ─── Reusable mini-section wrapper ───────────────────────────────────────────

function SectionWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  );
}

// ─── Undangan Digital Card (renders from DIGITAL_INVITATION const) ─────────────

function UndanganDigitalCard({
  tier,
  lang,
}: {
  tier: (typeof DIGITAL_INVITATION.tiers)[number];
  lang: "id" | "en";
}) {
  const isPremium = tier.id === "premium";
  const isCustom = tier.id === "custom";
  const ctaHref = isCustom ? "/contact?service=digital-invitation" : "/order?package=" + tier.id;

  return (
    <div
      className={`
        relative flex flex-col border transition-all duration-300 h-full
        ${isPremium
          ? "border-[#c9a96e]/40 bg-gradient-to-b from-[#1a1408] to-[#0a0a0a]"
          : isCustom
          ? "border-[#c9a96e]/20 bg-[#0f0f0f]"
          : "border-white/[0.07] bg-[#0a0a0a]"
        }
      `}
      style={
        isPremium
          ? { boxShadow: "0 0 40px rgba(201,169,110,0.08), 0 0 0 1px rgba(201,169,110,0.15)" }
          : undefined
      }
    >
      {isPremium && (
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
      )}

      <div className="p-5 lg:p-6 flex flex-col flex-1">
        {tier.badge && (
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#c9a96e] mb-3">
            {tier.badge}
          </p>
        )}
        <h3 className="font-serif text-xl text-[#faf8f5] mb-1">
          {tier.label.charAt(0).toUpperCase() + tier.label.slice(1)}
        </h3>
        <p className="text-[10px] text-[#6a6a6a] leading-relaxed mb-5">
          {tier.price.startLabel
            ? `${tier.price.startLabel} ${formatPriceRange(tier.price)}`
            : formatPriceRange(tier.price)}
        </p>
        <div className="h-px bg-white/[0.06] mb-4" />
        {tier.tagline && (
          <p className="text-xs text-[#8a8a8a] leading-relaxed mb-4 italic">
            {tier.tagline}
          </p>
        )}
        <div className="flex-1 mb-6 space-y-1.5">
          {tier.features
            .filter((f) => f.included)
            .map((f) => (
              <div key={f.text} className="flex items-start gap-2">
                <span className="text-[#c9a96e] text-xs mt-0.5 shrink-0">✓</span>
                <span className="text-xs text-[#8a8a8a] leading-relaxed">{f.text}</span>
              </div>
            ))}
        </div>
        <Link
          href={ctaHref}
          className="block w-full py-2.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] transition-colors text-center"
        >
          {isCustom
            ? lang === "id" ? "Konsultasi Gratis" : "Free Consultation"
            : lang === "id" ? "Pesan" : "Order"}
        </Link>
      </div>
    </div>
  );
}

// ─── Sub-section wrapper for 3-col grid ──────────────────────────────────────

function MiniPricingSection({
  overline,
  title,
  subtitle,
  children,
}: {
  overline: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-20">
      <ScrollReveal>
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">{overline}</p>
          <h2 className="font-serif text-2xl lg:text-3xl text-[#faf8f5] mb-3">{title}</h2>
          {subtitle && (
            <p className="text-sm text-[#9a9a9a] max-w-xl mx-auto">{subtitle}</p>
          )}
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-4">
        {children}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default async function PricingPage() {
  const lang = await getServerLanguage();
  const t = translations[lang].pages.pricing;
  const home = translations[lang].home;
  const invitationTiers = getTranslatedPricingTiers(lang);
  const saveTheDateTiers = getTranslatedSaveTheDateTiers(lang);
  const websiteTiers = getTranslatedWebsiteTiers(lang);
  const addons = getTranslatedAddOns(lang);

  const anchorNav = [
    { id: "undangan-digital", label: t.navUndangan },
    { id: "foto-video", label: t.navFotoVideo },
    { id: "content-creator", label: t.navContent },
    { id: "souvenir", label: t.navSouvenir },
    { id: "website", label: t.navWebsite },
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-12 text-center">
        <ScrollReveal>
          <SectionHeading
            overline={t.overline}
            title={t.title}
            subtitle={t.subtitle}
          />
        </ScrollReveal>

        {/* Anchor nav */}
        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
            {anchorNav.map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                className="text-[11px] tracking-widest uppercase text-[#6a6a6a] hover:text-[#c9a96e] transition-colors border-b border-transparent hover:border-[#c9a96e]/40 pb-0.5"
              >
                {anchor.label}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* ── 1. Undangan Digital ── */}
      <SectionWrapper id="undangan-digital">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">
                {home.pricingOverline}
              </p>
              <h2 className="font-serif text-2xl lg:text-3xl text-[#faf8f5] mb-3">
                {home.pricingTitle}
              </h2>
              <p className="text-sm text-[#9a9a9a] max-w-xl mx-auto">
                {home.pricingSubtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5 items-stretch">
            {DIGITAL_INVITATION.tiers.map((tier, i) => (
              <ScrollReveal key={tier.id} delay={i * 100}>
                <UndanganDigitalCard tier={tier} lang={lang} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 my-16">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── 2. Foto & Video Wedding (re-use landing page component) ── */}
      <SectionWrapper id="foto-video">
        {/* Use stripped-down header (no ScrollReveal wrapper) */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">
                {t.fotoVideo.overline}
              </p>
              <h2 className="font-serif text-2xl lg:text-3xl text-[#faf8f5] mb-3">
                {t.fotoVideo.title}
              </h2>
              <p className="text-sm text-[#9a9a9a] max-w-xl mx-auto">
                {t.fotoVideo.subtitle}
              </p>
            </div>
          </ScrollReveal>
          {/* Inline rendering of photography cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5 items-stretch">
            {WEDDING_PHOTOGRAPHY.tiers.map((tier, i) => {
              const isPaket1 = tier.id === "paket_1";
              return (
                <ScrollReveal key={tier.id} delay={i * 100}>
                  <div
                    className={`
                      relative flex flex-col border transition-all duration-300 h-full
                      ${isPaket1
                        ? "border-[#c9a96e]/40 bg-gradient-to-b from-[#1a1408] to-[#0f0f0f]"
                        : "border-white/[0.07] bg-[#0a0a0a]"
                      }
                    `}
                    style={
                      isPaket1
                        ? { boxShadow: "0 0 40px rgba(201,169,110,0.08), 0 0 0 1px rgba(201,169,110,0.15)" }
                        : undefined
                    }
                  >
                    {isPaket1 && (
                      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
                    )}
                    <div className="p-5 lg:p-6 flex flex-col flex-1">
                      <h3 className="font-serif text-xl text-[#faf8f5] mb-1">{tier.label}</h3>
                      <p className="text-[10px] text-[#c9a96e] font-medium mb-4">
                        {formatPriceRange(tier.price)}
                      </p>
                      <div className="h-px bg-white/[0.06] mb-4" />
                      <div className="flex gap-3 mb-4">
                        <span className="text-[10px] text-[#6a6a6a]">{tier.durationHours} jam</span>
                        <span className="text-[10px] text-[#6a6a6a]">·</span>
                        <span className="text-[10px] text-[#6a6a6a]">{tier.photoCount} foto</span>
                        {tier.videoIncluded && (
                          <>
                            <span className="text-[10px] text-[#6a6a6a]">·</span>
                            <span className="text-[10px] text-[#6a6a6a]">Video</span>
                          </>
                        )}
                      </div>
                      <div className="flex-1 mb-6 space-y-1.5">
                        {[
                          tier.videoIncluded ? `Video cinematic ${tier.videoDuration ?? ""}` : null,
                          tier.albumDescription,
                          tier.photoPrint,
                          tier.flashDrive,
                        ]
                          .filter(Boolean)
                          .slice(0, 4)
                          .map((feat) => (
                            <div key={feat as string} className="flex items-start gap-2">
                              <span className="text-[#c9a96e] text-xs mt-0.5 shrink-0">✓</span>
                              <span className="text-xs text-[#8a8a8a] leading-relaxed">{feat}</span>
                            </div>
                          ))}
                      </div>
                      <Link
                        href="/contact?service=photography"
                        className="block w-full py-2.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] transition-colors text-center mt-auto"
                      >
                        Tanya via WhatsApp
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 my-16">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── 3. Wedding Content Creator ── */}
      <SectionWrapper id="content-creator">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">
                {t.contentCreator.overline}
              </p>
              <h2 className="font-serif text-2xl lg:text-3xl text-[#faf8f5] mb-3">
                {t.contentCreator.title}
              </h2>
              <p className="text-sm text-[#9a9a9a] max-w-xl mx-auto">
                {t.contentCreator.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5 items-stretch">
            {CONTENT_CREATOR.tiers.map((tier, i) => {
              const isGold = tier.id === "gold";
              const features: string[] = [];
              if (tier.storyIGRealtime) features.push(`${tier.storyIGRealtime}x Story IG Takeover`);
              if (tier.storyIGCuts) features.push(`${tier.storyIGCuts}x Story cut to cut`);
              if (tier.videoHighlightCount) features.push(`${tier.videoHighlightCount}x Highlight`);
              if (tier.unlimitedMomentVideo) features.push("Unlimited Moment Video");
              if (tier.cloudDrive) features.push(tier.cloudDrive);

              return (
                <ScrollReveal key={tier.id} delay={i * 100}>
                  <div
                    className={`
                      relative flex flex-col border transition-all duration-300 h-full
                      ${isGold
                        ? "border-[#c9a96e]/40 bg-gradient-to-b from-[#1a1408] to-[#0a0a0a] md:-mt-4 md:mb-[-16px] md:pt-6 md:pb-6"
                        : "border-white/[0.07] bg-[#0a0a0a]"
                      }
                    `}
                    style={
                      isGold
                        ? { boxShadow: "0 0 40px rgba(201,169,110,0.08), 0 0 0 1px rgba(201,169,110,0.15)" }
                        : undefined
                    }
                  >
                    {isGold && (
                      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
                    )}
                    <div className="p-5 lg:p-6 flex flex-col flex-1">
                      {tier.badge && (
                        <p className="text-[9px] tracking-[0.25em] uppercase text-[#c9a96e] mb-3">
                          {tier.badge}
                        </p>
                      )}
                      <h3 className="font-serif text-xl text-[#faf8f5] mb-1">{tier.label}</h3>
                      <p className="text-[10px] text-[#c9a96e] font-medium mb-4">
                        {formatPriceRange(tier.price)} / {tier.durationHours} jam
                      </p>
                      <div className="h-px bg-white/[0.06] mb-4" />
                      {tier.suitableFor && tier.suitableFor.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {tier.suitableFor.slice(0, 3).map((s) => (
                              <span key={s} className="text-[9px] px-2 py-0.5 border border-white/10 text-[#6a6a6a]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex-1 mb-6 space-y-1.5">
                        {features.slice(0, 4).map((feat) => (
                          <div key={feat} className="flex items-start gap-2">
                            <span className="text-[#c9a96e] text-xs mt-0.5 shrink-0">✓</span>
                            <span className="text-xs text-[#8a8a8a] leading-relaxed">{feat}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/contact?service=content-creator"
                        className="block w-full py-2.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] transition-colors text-center mt-auto"
                      >
                        {lang === "id" ? "Pesan Sekarang" : "Order Now"}
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={200}>
            <p className="text-center text-[11px] text-[#6a6a6a] mt-8">
              {t.contentCreator.note}
            </p>
          </ScrollReveal>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 my-16">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── 4. Desain Souvenir ── */}
      <SectionWrapper id="souvenir">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">
                {t.souvenir.overline}
              </p>
              <h2 className="font-serif text-2xl lg:text-3xl text-[#faf8f5] mb-3">
                {t.souvenir.title}
              </h2>
              <p className="text-sm text-[#9a9a9a] max-w-xl mx-auto">
                {t.souvenir.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {SOUVENIR_DESIGN.products.map((product, i) => {
              const isCustom = product.id === "custom_produk";

              return (
                <ScrollReveal key={product.id} delay={i * 100}>
                  <div
                    className={`
                      border p-6 flex flex-col h-full
                      ${isCustom ? "border-[#c9a96e]/20 bg-[#0f0f0f]" : "border-white/[0.07] bg-[#0a0a0a]"}
                    `}
                  >
                    <div className="flex-1">
                      <h3 className="font-serif text-xl text-[#faf8f5] mb-1">{product.name}</h3>
                      <p className="text-[10px] text-[#c9a96e] font-medium mb-4">
                        {isCustom
                          ? `${t.souvenir.mulaiDari} ${formatPriceRange(product.priceBreaks[0].pricePerUnit)}/pcs`
                          : `${formatPriceRange(product.priceBreaks.at(-1)!.pricePerUnit)} – ${formatPriceRange(product.priceBreaks[0].pricePerUnit)}/pcs`}
                      </p>
                      <div className="h-px bg-white/[0.06] mb-4" />
                      {!isCustom && product.priceBreaks && (
                        <div className="mb-4">
                          <p className="text-[9px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-2">Struktur Harga</p>
                          {product.priceBreaks.map((pb) => (
                            <div key={pb.quantity} className="flex justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                              <span className="text-xs text-[#8a8a8a]">{pb.quantity} pcs</span>
                              <span className="text-xs text-[#c9a96e] font-medium">{formatPriceRange(pb.pricePerUnit)}/pcs</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {isCustom && product.includes && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {product.includes.join(" ").split(", ").map((item) => (
                              <span key={item} className="text-[10px] px-2.5 py-1 border border-white/10 text-[#8a8a8a]">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="space-y-1.5 mb-6">
                        {product.includes.map((inc) => (
                          <div key={inc} className="flex items-start gap-2">
                            <span className="text-[#c9a96e] text-xs mt-0.5 shrink-0">✓</span>
                            <span className="text-xs text-[#8a8a8a] leading-relaxed">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={isCustom ? "/contact?service=souvenir" : "/contact?service=souvenir"}
                      className="block w-full py-2.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] transition-colors text-center mt-4"
                    >
                      {isCustom ? t.souvenir.ctaKonsultasi : t.souvenir.ctaOrder}
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 my-16">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── TODO: Save the Date (belum ada di services.ts, pertahankan sementara) ── */}
      {/* TODO: sectionSaveTheDate akan di-enable setelah data Save the Date ditambahkan ke lib/constants/services.ts */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <MiniPricingSection
          overline={t.saveTheDate.overline}
          title={t.saveTheDate.title}
          subtitle={t.saveTheDate.subtitle}
        >
          {saveTheDateTiers.map((tier, i) => (
            <ScrollReveal key={tier.name} delay={i * 100}>
              <PricingCard tier={tier} />
            </ScrollReveal>
          ))}
        </MiniPricingSection>
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 my-16">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── 5. Wedding Website ── */}
      <SectionWrapper id="website">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <MiniPricingSection
            overline={t.website.overline}
            title={t.website.title}
            subtitle={t.website.subtitle}
          >
            {websiteTiers.map((tier, i) => (
              <ScrollReveal key={tier.name} delay={i * 100}>
                <PricingCard tier={tier} />
              </ScrollReveal>
            ))}
          </MiniPricingSection>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 my-16">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── 6. Add-ons ── */}
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
                  <h4 className="text-sm font-medium text-[#faf8f5]">{addon.name}</h4>
                  <span className="text-xs text-[#c9a96e] shrink-0">{addon.price}</span>
                </div>
                <p className="text-xs text-[#6a6a6a] leading-relaxed">{addon.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Price note */}
      <ScrollReveal delay={200}>
        <div className="max-w-2xl mx-auto px-6 mt-12 text-center">
          <p className="text-xs text-[#5a5a5a] leading-relaxed">{t.priceNote}</p>
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
