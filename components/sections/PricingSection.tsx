"use client";

import { useLanguage } from "@/lib/i18n/context";
import { useCart } from "@/lib/cart-context";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { memo } from "react";

const PRICING_TIERS = [
  {
    key: "basic" as const,
    priceId: "Mulai dari Rp 299.000",
    priceEn: "Starting from Rp 299.000",
    gradient: "from-[#1a1206] to-[#2a2010]",
    accent: "#c9a96e",
    border: "rgba(201,169,110,0.15)",
  },
  {
    key: "premium" as const,
    priceId: "Mulai dari Rp 599.000",
    priceEn: "Starting from Rp 599.000",
    gradient: "from-[#1a1206] to-[#3d2e0f]",
    accent: "#c9a96e",
    border: "rgba(201,169,110,0.35)",
    featured: true,
  },
  {
    key: "exclusive" as const,
    priceId: "Custom",
    priceEn: "Custom",
    gradient: "from-[#1a0a06] to-[#2a1508]",
    accent: "#c9a96e",
    border: "rgba(201,169,110,0.2)",
  },
];

const OrderButton = memo(function OrderButton({ tier }: { tier: (typeof PRICING_TIERS)[number] }) {
  const { openOrder } = useCart();

  const handleOrder = () => {
    openOrder({ name: tier.key, slug: tier.key, category: "pricing" });
  };

  return (
    <button
      onClick={handleOrder}
      className="w-full py-2.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] transition-colors"
    >
      Pesan
    </button>
  );
});

export function PricingSection() {
  const { t, lang } = useLanguage();
  const home = t as unknown as Record<string, Record<string, string>>;

  return (
    <section className="bg-[#0f0f0f] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] font-medium mb-3">
              {home.home?.pricingOverline}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#faf8f5] mb-4">
              {home.home?.pricingTitle}
            </h2>
            <p className="text-sm text-[#8a8a8a] max-w-lg mx-auto leading-relaxed">
              {home.home?.pricingSubtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {PRICING_TIERS.map((tier, i) => (
            <ScrollReveal key={tier.key} delay={i * 100}>
              <div
                className={`relative flex flex-col border transition-all duration-300 ${
                  tier.featured
                    ? "border-[#c9a96e]/40 bg-gradient-to-b " + tier.gradient + " md:-mt-4 md:mb-[-16px] md:pt-6 md:pb-6"
                    : "border-white/[0.07] bg-[#0a0a0a]"
                }`}
                style={{
                  boxShadow: tier.featured
                    ? "0 0 40px rgba(201,169,110,0.08), 0 0 0 1px rgba(201,169,110,0.15)"
                    : undefined,
                }}
              >
                {/* Featured label */}
                {tier.featured && (
                  <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="mb-5">
                    {tier.featured && (
                      <p className="text-[9px] tracking-[0.25em] uppercase text-[#c9a96e] mb-3">
                        Most Popular
                      </p>
                    )}
                    <h3 className="font-serif text-xl text-[#faf8f5] mb-1">
                      {lang === "id" ? tier.key.charAt(0).toUpperCase() + tier.key.slice(1) : tier.key.charAt(0).toUpperCase() + tier.key.slice(1)}
                    </h3>
                    <p className="text-[10px] text-[#6a6a6a] leading-relaxed">
                      {lang === "id" ? tier.priceId : tier.priceEn}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/[0.06] mb-5" />

                  {/* Description */}
                  <div className="flex-1 mb-6">
                    <p className="text-xs text-[#8a8a8a] leading-relaxed">
                      {home.home?.[`pricing${tier.key.charAt(0).toUpperCase() + tier.key.slice(1)}Desc` as keyof typeof home.home]}
                    </p>
                    {tier.key === "exclusive" && (
                      <p className="text-[10px] text-[#6a6a6a] mt-2 italic">
                        {home.home?.pricingCustomNote}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {(tier.key === "basic"
                      ? [
                          "1 Template Pilihan",
                          "Desain Premium",
                          "Revisi Minor",
                          "Unlimited Guests",
                          "Support via WhatsApp",
                        ]
                      : tier.key === "premium"
                      ? [
                          "3+ Template Pilihan",
                          "Semua fitur Basic",
                          "RSVP Online",
                          "Kustomisasi Tambahan",
                          "Revisi Major",
                          "Priority Support",
                        ]
                      : [
                          "Unlimited Template",
                          "Semua fitur Premium",
                          "Fully Custom Design",
                          "Konsultasi Pribadi",
                          "Revisi Unlimited",
                          "Wedding Branding Kit",
                          "Priority Production",
                        ]
                    ).map((feat) => (
                      <div key={feat} className="flex items-start gap-2">
                        <span className="text-[#c9a96e] text-xs mt-0.5 shrink-0">✓</span>
                        <span className="text-xs text-[#8a8a8a]">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <OrderButton tier={tier} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom note */}
        <ScrollReveal delay={400}>
          <p className="text-center text-[11px] text-[#6a6a6a] mt-8 leading-relaxed">
            {lang === "id"
              ? "Semua harga dalam Rupiah. Harga dapat berubah sewaktu-waktu. Hubungi kami untuk paket custom."
              : "All prices in Indonesian Rupiah. Prices are subject to change. Contact us for custom packages."}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
