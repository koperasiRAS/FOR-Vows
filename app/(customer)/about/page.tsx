import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { CTASection } from "@/components/sections/CTASection";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

export const metadata = {
  title: "Tentang FOR Vows | FOR Vows",
  description: "FOR Vows adalah studio undangan pernikahan digital premium dari Jakarta. Membantu pasangan menciptakan undangan yang sakral, elegan, dan tak terlupakan.",
  openGraph: {
    title: "Tentang FOR Vows | FOR Vows",
    description: "Studio undangan pernikahan digital premium dari Jakarta. Crafting Your Sacred Moments.",
    url: "https://for-vows.vercel.app/about",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default async function AboutPage() {
  const lang = await getServerLanguage();
  const t = translations[lang].about;

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Brand Story */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="space-y-6">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e]">
                {t.overline}
              </p>
              <h1 className="font-serif text-4xl lg:text-5xl text-[#faf8f5] leading-tight">
                {t.headline}
              </h1>
              <div className="space-y-4 text-[#8a8a8a] leading-relaxed text-sm">
                <p>{t.storyP1}</p>
                <p>
                  {t.storyP2A}
                  <span className="text-[#faf8f5]">{t.storyP2B}</span>
                  {t.storyP2C}
                </p>
                <p>{t.storyP3}</p>
              </div>
              {/* Frame Of Rangga Link */}
              <div className="pt-4 border-t border-white/[0.06]">
                <a
                  href="https://for-portofolio.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors group"
                >
                  <span>{t.lihatKarya}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="relative aspect-square overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[#1a1206] via-[#2d1f0a] to-[#1a1206]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-10">
                <div className="space-y-2">
                  <span className="text-xs tracking-[0.3em] uppercase text-[#c9a96e]/50">
                    {t.subBrand}
                  </span>
                  <p className="font-serif text-2xl text-[#c9a96e]/60">
                    {t.storyP2B}
                  </p>
                </div>
                <div className="w-20 h-px bg-[#c9a96e]/20" />
                <div className="space-y-1">
                  <p className="font-serif italic text-4xl text-[#c9a96e]/40">
                    FOR
                  </p>
                  <p className="font-serif italic text-3xl text-[#c9a96e]/30">
                    Vows
                  </p>
                </div>
              </div>
              <div className="absolute inset-4 border border-[#c9a96e]/10 pointer-events-none" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#0f0f0f] mt-20 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              overline={t.philosophyOverline}
              title={t.philosophyTitle}
              subtitle={t.philosophySubtitle}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 lg:mt-16">
            {[
              { num: "01", title: t.v1Title, description: t.v1Desc },
              { num: "02", title: t.v2Title, description: t.v2Desc },
              { num: "03", title: t.v3Title, description: t.v3Desc },
              { num: "04", title: t.v4Title, description: t.v4Desc },
            ].map((value, i) => (
              <ScrollReveal key={value.num} delay={i * 80}>
                <div className="p-8 border border-white/[0.06] bg-[#0a0a0a] space-y-3">
                  <span className="text-xs font-mono text-[#c9a96e]/50">
                    {value.num}
                  </span>
                  <h3 className="font-serif text-lg text-[#faf8f5]">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#6a6a6a] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        overline={t.ctaOverline}
        title={t.ctaTitle}
        subtitle={t.ctaSubtitle}
        primaryCta={{ label: t.ctaHubungi, href: "/contact" }}
        secondaryCta={{ label: t.ctaLihat, href: "/templates" }}
      />
    </div>
  );
}
