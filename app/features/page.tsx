import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { FeatureCard } from "@/components/features/FeatureCard";
import { CTASection } from "@/components/sections/CTASection";
import { features } from "@/lib/templates";

export default function FeaturesPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline="Kemampuan"
            title="Fitur yang Berarti"
            subtitle="Setiap elemen undangan digital Anda didesain untuk menciptakan pengalaman yang seamless dan elegan bagi Anda dan tamu Anda."
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
            Semua fitur sudah termasuk berdasarkan paket yang Anda pilih. Paket
            Exclusive mencakup semua fitur dengan kustomisasi penuh.
          </p>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <CTASection
        overline="Siap Merasakannya?"
        title="Lihat Fitur Ini Beraksi"
        subtitle="Pilih template dan temukan bagaimana undangan digital premium bisa terasa."
        primaryCta={{ label: "Jelajahi Template", href: "/templates" }}
        secondaryCta={{ label: "Lihat Harga", href: "/pricing" }}
      />
    </div>
  );
}
