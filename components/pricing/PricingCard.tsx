"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { useLanguage } from "@/lib/i18n/context";
import type { PricingTier } from "@/types";

interface PricingCardProps {
  tier: PricingTier;
}

export function PricingCard({ tier }: PricingCardProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`relative flex flex-col p-8 border h-full transition-all duration-300 ${
        tier.highlighted
          ? "bg-[#141414] border-[#c9a96e]/60 shadow-[0_0_40px_rgba(201,169,110,0.08)]"
          : "bg-[#0f0f0f] border-white/[0.07] hover:border-white/[0.12]"
      }`}
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] tracking-[0.2em] uppercase bg-[#c9a96e] text-[#0a0a0a] px-4 py-1 font-medium">
            {tier.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-4 pb-8 border-b border-white/[0.06]">
        <h3
          className={`font-serif text-2xl ${
            tier.highlighted ? "text-[#c9a96e]" : "text-[#faf8f5]"
          }`}
        >
          {tier.name}
        </h3>
        <div>
          <p className="font-serif text-3xl text-[#faf8f5]">{tier.price}</p>
        </div>
        <p className="text-sm text-[#6a6a6a] leading-relaxed">
          {tier.description}
        </p>
      </div>

      {/* Features */}
      <ul className="flex-1 py-6 space-y-3">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check
              size={14}
              className={`mt-0.5 shrink-0 ${
                tier.highlighted ? "text-[#c9a96e]" : "text-[#8a8a8a]"
              }`}
            />
            <span className="text-sm text-[#8a8a8a]">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto space-y-3">
        <AddToCartButton
          item={{
            id: `package-${tier.name.toLowerCase()}`,
            type: "package",
            name: `Paket ${tier.name}`,
            price: tier.price,
            priceValue: parseInt(tier.price.replace(/[^\d]/g, "")),
          }}
          variant={tier.highlighted ? "gold" : "outline"}
          label={t("pricingCard.pilihPaket", { name: tier.name })}
        />
        <Link
          href={`/contact?package=${tier.name.toLowerCase()}`}
          className="flex items-center justify-center py-2.5 text-[11px] tracking-widest uppercase text-[#6a6a6a] hover:text-[#8a8a8a] transition-colors"
        >
          {t("pricingCard.hubungiCustom")}
        </Link>
      </div>
    </div>
  );
}
