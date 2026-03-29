import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { HowItWorksStep } from "@/components/shared/HowItWorksStep";
import { CTASection } from "@/components/sections/CTASection";
import { howItWorksSteps } from "@/lib/templates";

export default function HowItWorksPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline="Perjalanan Anda"
            title="Dari Visi Menuju Undangan Terbit"
            subtitle="Proses yang seamless dan penuh perhatian — agar Anda bisa fokus merayakan sementara kami yang menangani undangannya."
          />
        </ScrollReveal>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="border-l border-[#c9a96e]/10 pl-8 lg:pl-12">
          {howItWorksSteps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 100}>
              <HowItWorksStep step={step} last={i === howItWorksSteps.length - 1} />
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
              <p className="text-xs text-[#6a6a6a]">Hari kerja pengiriman</p>
            </div>
            <div className="text-center space-y-1 border-x border-white/[0.06]">
              <p className="font-serif text-2xl text-[#c9a96e]">1</p>
              <p className="text-xs text-[#6a6a6a]">Sesi revisi gratis</p>
            </div>
            <div className="text-center space-y-1">
              <p className="font-serif text-2xl text-[#c9a96e]">48h</p>
              <p className="text-xs text-[#6a6a6a]">Opsi pengiriman kilat tersedia</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <CTASection
        overline="Siap Memulai?"
        title="Undangan Sempurna Anda Tinggal Lima Langkah"
        subtitle="Mulailah dengan memilih template yang berbicara di hati Anda."
        primaryCta={{ label: "Lihat Template", href: "/templates" }}
        secondaryCta={{ label: "Hubungi Kami", href: "/contact" }}
      />
    </div>
  );
}
