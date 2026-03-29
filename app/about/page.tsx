import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { CTASection } from "@/components/sections/CTASection";

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Brand Story */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="space-y-6">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e]">
                Kisah Kami
              </p>
              <h1 className="font-serif text-4xl lg:text-5xl text-[#faf8f5] leading-tight">
                FOR Vows lahir dari keyakinan sederhana
              </h1>
              <div className="space-y-4 text-[#8a8a8a] leading-relaxed text-sm">
                <p>
                  Undangan pernikahan bukan sekadar formalitas — ini adalah napas
                  pertama perayaan Anda, momen pertama tamu merasakan bobot dan
                  kegembiraan yang akan datang. Ia layak lebih dari template generik.
                </p>
                <p>
                  FOR Vows didirikan sebagai divisi undangan pernikahan dari{" "}
                  <span className="text-[#faf8f5]">Frame Of Rangga</span>, studio
                  kreatif yang dikenal dengan karya editorial dalam fotografi dan
                  storytelling visual. Dari turunan itu, kami membawa standar,
                  selera, dan dedikasi yang sama ke dunia undangan pernikahan digital.
                </p>
                <p>
                  Nama kami membawa niat: <em>FOR</em> — untuk melayani —{" "}
                  <em>Vows</em> — janji suci yang Anda berikan satu sama lain. Setiap
                  undangan yang kami buat adalah testamentasi untuk dedikasi itu.
                </p>
              </div>
              {/* Frame Of Rangga Link */}
              <div className="pt-4 border-t border-white/[0.06]">
                <a
                  href="https://for-portofolio.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors group"
                >
                  <span>Lihat karya utama Frame Of Rangga</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="relative aspect-square overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1206] via-[#2d1f0a] to-[#1a1206]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-10">
                <div className="space-y-2">
                  <span className="text-xs tracking-[0.3em] uppercase text-[#c9a96e]/50">
                    Sub-brand dari
                  </span>
                  <p className="font-serif text-2xl text-[#c9a96e]/60">
                    Frame Of Rangga
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
              overline="Filosofi Kami"
              title="Apa yang Kamiutamakan"
              subtitle="Empat prinsip yang memandu setiap undangan yang kami buat"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 lg:mt-16">
            {[
              {
                num: "01",
                title: "Niat Di atas Kecepatan",
                description:
                  "Kami mengambil waktu untuk memahami kisah, estetika, dan visi Anda — lalu kami membuat undangan yang hanya bisa milik Anda.",
              },
              {
                num: "02",
                title: "Tamu Utama",
                description:
                  "Setiap keputusan — dari tipografi hingga navigasi — dibuat dengan pengalaman tamu Anda sebagai prioritas. Undangan seharusnya terasa seperti pelukan.",
              },
              {
                num: "03",
                title: "Kemewahan Terkurung",
                description:
                  "Keeleganan sejati bukan tentang berlebih lebihan. Kami percaya pada detail yang refined, tipografi yang cermat, dan ornamentasi yang bermakna — tanpa clutter.",
              },
              {
                num: "04",
                title: "Teknologi untuk Melayani",
                description:
                  "Tool digital memungkinkan kami membuat sesuatu yang tidak bisa dilakukan kertas — interaktif, personal, hidup. Kami menggunakan teknologi untuk memperdalam, bukan mengalihkan.",
              },
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
        overline="Bekerja Sama Dengan Kami"
        title="Siap Membuat Sesuatu yang Indah?"
        subtitle="Mari bicarakan pernikahan Anda dan buat undangan yang layak untuk kisah Anda."
        primaryCta={{ label: "Hubungi Kami", href: "/contact" }}
        secondaryCta={{ label: "Lihat Template", href: "/templates" }}
      />
    </div>
  );
}
