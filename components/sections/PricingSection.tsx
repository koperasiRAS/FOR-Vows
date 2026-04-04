"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { DIGITAL_INVITATION, formatPriceRange } from "@/lib/constants/services";

const tiers = DIGITAL_INVITATION.tiers;

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[#c9a96e] text-xs mt-0.5 shrink-0">✓</span>
      <span className="text-xs text-[#8a8a8a] leading-relaxed">{text}</span>
    </div>
  );
}

function CTAButton({ tierId, label }: { tierId: string; label: string }) {
  const href = tierId === "custom" ? "/contact" : `/order?package=${tierId}`;
  return (
    <Link
      href={href}
      className="block w-full py-2.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] transition-colors text-center"
    >
      {label}
    </Link>
  );
}

export function PricingSection() {
  const { t, lang } = useLanguage();
  const home = t as unknown as Record<string, Record<string, string>>;

  return (
    <section className="bg-[#0f0f0f] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] font-medium mb-3">
              {lang === "id" ? "Undangan Digital" : "Digital Invitation"}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#faf8f5] mb-4">
              {lang === "id" ? "Paket Undangan Digital" : "Digital Invitation Packages"}
            </h2>
            <p className="text-sm text-[#8a8a8a] max-w-lg mx-auto leading-relaxed">
              {lang === "id" 
                ? "Pilih paket yang paling sesuai dengan kebutuhan perayaan momen spesial Anda. Semua paket dirancang untuk memberikan kesan yang elegan dan mewah."
                : "Choose the package that best fits your special moment celebration needs. All packages are designed to provide an elegant and luxurious impression."}
            </p>
          </div>
        </ScrollReveal>

        {/* 4-card grid: 1 col mobile / 2 col tablet / 4 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5 items-stretch">
          {tiers.map((tier, i) => {
            const isPremium = tier.id === "premium";
            const isCustom = tier.id === "custom";

            return (
              <ScrollReveal key={tier.id} delay={i * 100}>
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
                  {/* Top gold line for featured */}
                  {isPremium && (
                    <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
                  )}

                  <div className="p-5 lg:p-6 flex flex-col flex-1">

                    {/* Badge */}
                    {tier.badge && (
                      <p className="text-[9px] tracking-[0.25em] uppercase text-[#c9a96e] mb-3">
                        {tier.badge}
                      </p>
                    )}

                    {/* Label */}
                    <h3 className="font-serif text-xl text-[#faf8f5] mb-1">
                      {lang === "id"
                        ? tier.label.charAt(0).toUpperCase() + tier.label.slice(1)
                        : tier.label.charAt(0).toUpperCase() + tier.label.slice(1)
                      }
                    </h3>

                    {/* Price */}
                    <p className="text-[10px] text-[#6a6a6a] leading-relaxed mb-5">
                      {tier.price.startLabel
                        ? `${tier.price.startLabel} ${formatPriceRange(tier.price)}`
                        : formatPriceRange(tier.price)
                      }
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.06] mb-5" />

                    {/* Tagline */}
                    {tier.tagline && (
                      <p className="text-xs text-[#8a8a8a] leading-relaxed mb-5 italic">
                        {tier.tagline}
                      </p>
                    )}

                    {/* Features */}
                    <div className="flex-1 mb-6 space-y-2">
                      {tier.features
                        .filter((f) => f.included)
                        .map((feat) => (
                          <CheckItem key={feat.text} text={feat.text} />
                        ))}
                    </div>

                    {/* CTA */}
                    <CTAButton
                      tierId={tier.id}
                      label={isCustom
                        ? lang === "id" ? "Konsultasi Gratis" : "Free Consultation"
                        : lang === "id" ? "Pesan" : "Order"
                      }
                    />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
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
