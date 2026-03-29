import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PortfolioCard } from "@/components/shared/PortfolioCard";
import { CTASection } from "@/components/sections/CTASection";
import { portfolioItems } from "@/lib/templates";

export default function PortfolioPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline="Karya Kami"
            title="Undangan Pilihan"
            subtitle="Seleksi kurasi karya kami — masing-masing perayaan unik yang diabadikan dalam bentuk digital."
          />
        </ScrollReveal>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {portfolioItems.map((item, i) => (
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
            Setiap undangan dibuat custom untuk pasangan masing-masing. Untuk melihat demo langsung
            template apapun, hubungi kami dan kami akan arrange walkthrough personal.
          </p>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <CTASection
        overline="Buat Milik Anda"
        title="Undangan Anda Bisa Jadi Berikutnya"
        subtitle="Bergabunglah dengan pasangan yang memilih FOR Vows untuk perayaan paling penting mereka."
        primaryCta={{ label: "Mulai Undangan Anda", href: "/contact" }}
        secondaryCta={{ label: "Lihat Template", href: "/templates" }}
      />
    </div>
  );
}
