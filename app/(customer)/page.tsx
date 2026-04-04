import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { CTASection } from "@/components/sections/CTASection";
import { PricingSection } from "@/components/sections/PricingSection";
import { WeddingPhotographySection } from "@/components/sections/WeddingPhotographySection";
import { WeddingContentCreatorSection } from "@/components/sections/WeddingContentCreatorSection";
import { WeddingSouvenirSection } from "@/components/sections/WeddingSouvenirSection";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { HowItWorksStep } from "@/components/shared/HowItWorksStep";
import {
  templates,
  getTranslatedTestimonials,
  getTranslatedHowItWorksSteps,
} from "@/lib/templates";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "FOR Vows — Studio Kreatif Pernikahan | Undangan Digital, Foto Video & Content Creator",
  description:
    "Studio kreatif pernikahan premium dari Frame Of Rangga. Undangan digital yang Personal, foto video sinematik yang Tak Terlupakan, dan konten pernikahan yang Instagram-Worthy.",
  keywords: [
    "studio kreatif pernikahan",
    "undangan pernikahan digital",
    "foto video wedding jakarta",
    "wedding content creator",
    "desain souvenir pernikahan",
    "undangan digital premium",
    "for vows",
    "frame of rangga",
  ],
  openGraph: {
    title: "FOR Vows — Studio Kreatif Pernikahan | Undangan Digital, Foto Video & Content Creator",
    description: "Studio kreatif pernikahan premium dari Frame Of Rangga. Undangan digital yang Personal, foto video sinematik yang Tak Terlupakan, dan konten pernikahan yang Instagram-Worthy.",
    url: "https://for-vows.vercel.app",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default async function HomePage() {
  const lang = await getServerLanguage();
  const t = translations[lang].home;
  const translatedTestimonials = getTranslatedTestimonials(lang);
  const translatedSteps = getTranslatedHowItWorksSteps(lang);

  const featuredTemplates = templates.filter((t) => t.featured).slice(0, 3);

  const categoryMap: Record<string, { descKey: keyof typeof t }> = {
    luxury: { descKey: "catLuxury" },
    adat: { descKey: "catAdat" },
    modern: { descKey: "catModern" },
    intimate: { descKey: "catIntimate" },
  };

  const valueProps = [
    { number: "01", title: t.vp1Title, description: t.vp1Desc },
    { number: "02", title: t.vp2Title, description: t.vp2Desc },
    { number: "03", title: t.vp3Title, description: t.vp3Desc },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        {/* Background gradient — elegant dark + warm gold glows */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(201,169,110,0.08) 0%, transparent 60%)",
              "radial-gradient(ellipse 50% 40% at 20% 90%, rgba(201,169,110,0.04) 0%, transparent 50%)",
              "radial-gradient(ellipse 50% 40% at 80% 85%, rgba(201,169,110,0.03) 0%, transparent 50%)",
            ].join(", "),
          }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[#0a0a0a]/60 sm:bg-[#0a0a0a]/55 md:bg-[#0a0a0a]/50" />

        {/* Decorative accent lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-transparent via-[#c9a96e]/20 to-transparent" />
          <div className="absolute top-0 left-1/4 w-px h-16 bg-linear-to-b from-transparent to-white/[0.03]" />
          <div className="absolute top-0 right-1/4 w-px h-16 bg-linear-to-b from-transparent to-white/[0.03]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 pt-20">
          {/* Tagline badge */}
          <div className="space-y-2">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.4em] uppercase text-[#c9a96e] font-medium">
              {t.heroTagline}
            </p>
            <div className="w-16 h-px bg-[#c9a96e]/40 mx-auto" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-medium leading-[1.05] tracking-tight">
            <span className="block text-[#faf8f5]">Ceritakan</span>
            <span className="block text-[#faf8f5]">
              Kisah Cinta
            </span>
            <span className="block mt-2">
              <span className="text-[#c9a96e] italic">Anda</span>
              <span className="block text-[#faf8f5]">Lewat Detail</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="font-accent italic text-lg sm:text-xl md:text-2xl text-[#9a9a9a] sm:text-[#8a8a8a] max-w-2xl mx-auto leading-relaxed px-2">
            Undangan digital yang Personal. Foto dan video sinematik yang Tak Terlupakan.
            Konten pernikahan yang Instagram-Worthy. Semuanya dalam satu studio.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/templates"
              className="px-10 py-4 text-[11px] tracking-[0.2em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] hover:shadow-[0_0_30px_rgba(201,169,110,0.25)] transition-all duration-300"
            >
              {t.heroCta1}
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 text-[11px] tracking-[0.2em] uppercase border border-white/20 text-[#faf8f5] hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              {t.heroCta2}
            </Link>
          </div>

          {/* Sub-brand */}
          <p className="text-xs text-[#4a4a4a] tracking-wider pt-4">
            {t.heroSubBrand}
          </p>
        </div>
      </section>

      {/* Pricing - Undangan Digital */}
      <PricingSection />

      {/* Foto & Video Wedding */}
      <WeddingPhotographySection />

      {/* Wedding Content Creator */}
      <WeddingContentCreatorSection />

      {/* Desain Souvenir */}
      <WeddingSouvenirSection />

      {/* Featured Templates */}
      <section className="bg-[#0f0f0f] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              overline={t.featuredOverline}
              title={t.featuredTitle}
              subtitle={t.featuredSubtitle}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 lg:mt-16 items-stretch">

            {featuredTemplates.map((template, i) => (
              <ScrollReveal key={template.id} delay={i * 100}>
                <TemplateCard template={template} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={300}>
            <div className="text-center mt-12">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#c9a96e] hover:text-[#d4b87a] transition-colors border-b border-[#c9a96e]/30 hover:border-[#c9a96e] pb-0.5"
              >
                {t.viewAllTemplates}
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                  <path d="M1 4h14M10 1l4 3-4 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>



      {/* Why FOR Vows */}
      <section className="bg-[#141414] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <ScrollReveal>
              <SectionHeading
                overline={t.whyOverline}
                title={t.whyTitle}
                subtitle={t.whySubtitle}
                align="left"
              />
              <div className="mt-8 space-y-6">
                {valueProps.map((vp) => (
                  <div key={vp.number} className="flex gap-4">
                    <span className="text-xs text-[#c9a96e]/60 font-mono mt-1">
                      {vp.number}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-[#faf8f5]">
                        {vp.title}
                      </h4>
                      <p className="text-sm text-[#6a6a6a] mt-1 leading-relaxed">
                        {vp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="text-[11px] tracking-[0.15em] uppercase text-[#c9a96e] hover:text-[#d4b87a] border-b border-[#c9a96e]/30 hover:border-[#c9a96e] pb-0.5 transition-colors"
                >
                  {t.learnStory}
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-[#1a1206] via-[#2d1f0a] to-[#1a1206]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <p className="font-serif italic text-5xl text-[#c9a96e]/80">FOR</p>
                    <p className="font-serif italic text-4xl text-[#c9a96e]/50">Vows</p>
                    <div className="w-24 h-px bg-[#c9a96e]/30 mx-auto mt-2" />
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/40">
                      Crafting Your Sacred Moments
                    </p>
                  </div>
                </div>
                <div className="absolute inset-4 border border-[#c9a96e]/10 pointer-events-none" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>



      {/* How It Works Preview */}
      <section className="bg-[#0f0f0f] py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              overline={t.howOverline}
              title={t.howTitle}
              subtitle={t.howSubtitle}
            />
          </ScrollReveal>

          <div className="mt-14">
            {translatedSteps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 80}>
                <HowItWorksStep step={step} last={i === translatedSteps.length - 1} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <div className="text-center mt-12">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#c9a96e] hover:text-[#d4b87a] border-b border-[#c9a96e]/30 hover:border-[#c9a96e] pb-0.5 transition-colors"
              >
                {t.learnMore}
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                  <path d="M1 4h14M10 1l4 3-4 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="bg-[#0a0a0a] py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              overline={t.testimonialsOverline}
              title={t.testimonialsTitle}
              subtitle={t.testimonialsSubtitle}
            />
          </ScrollReveal>

          <div className="mt-12 lg:mt-16 -mx-6 px-6 lg:mx-0 lg:px-0">
             <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {translatedTestimonials.map((t, i) => (
                <div key={t.name} className="snap-center shrink-0 w-[85vw] md:w-[400px] lg:w-[420px]">
                  <ScrollReveal delay={i * 100}>
                    <TestimonialCard testimonial={t} />
                  </ScrollReveal>
                </div>
              ))}
              {/* Optional Empty space to allow last item to center nicely on mobile */}
              <div className="shrink-0 w-6 lg:hidden" />
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}} />
        </div>
      </section>



      {/* CTA */}
      <CTASection
        overline={t.ctaOverline}
        title={t.ctaTitle}
        subtitle={t.ctaSubtitle}
        primaryCta={{ label: t.ctaStart, href: "/contact" }}
        secondaryCta={{ label: t.ctaExplore, href: "/templates" }}
      />
    </>
  );
}
