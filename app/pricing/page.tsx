import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PricingCard } from "@/components/pricing/PricingCard";
import { CTASection } from "@/components/sections/CTASection";
import { pricingTiers, addOns } from "@/lib/templates";

export default function PricingPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline="Investasi"
            title="Harga Sederhana & Transparan"
            subtitle="Tiga paket yang didesain dengan cermat — masing-masing dibuat untuk memberikan undangan pernikahan Anda perhatian yang layak. Tanpa biaya tersembunyi."
          />
        </ScrollReveal>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-4">
          {pricingTiers.map((tier, i) => (
            <ScrollReveal key={tier.name} delay={i * 100}>
              <PricingCard tier={tier} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 mt-20">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">
              Tingkatkan Paket Anda
            </p>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#faf8f5]">
              Add-on Opsional
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((addon, i) => (
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
            Semua harga dalam Rupiah Indonesia (IDR) dan sudah termasuk
            arahan kreatif, pengiriman digital, dan 1 sesi revisi. Revisi
            tambahan tersedia dengan biaya Rp 75.000 per sesi.
          </p>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <CTASection
        overline="Belum Yakin Paket Mana?"
        title="Mari Cari yang Tepat Bersama"
        subtitle="Booking konsultasi gratis dan kami akan membantu Anda memilih paket yang sempurna untuk visi Anda."
        primaryCta={{ label: "Booking Konsultasi", href: "/contact" }}
        secondaryCta={{ label: "Lihat Template", href: "/templates" }}
      />
    </div>
  );
}
