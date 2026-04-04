"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { CONTENT_CREATOR } from "@/lib/constants/services";
import { formatIDR } from "@/lib/utils";

// Display order: Event, Silver, Gold, Platinum
const orderedTiers = [
  CONTENT_CREATOR.tiers.find((t) => t.id === "event")!,
  CONTENT_CREATOR.tiers.find((t) => t.id === "silver")!,
  CONTENT_CREATOR.tiers.find((t) => t.id === "gold")!,
  CONTENT_CREATOR.tiers.find((t) => t.id === "platinum")!,
];

function getKeyFeatures(tier: (typeof orderedTiers)[number]) {
  const features: string[] = [];
  if (tier.storyIGRealtime)
    features.push(`${tier.storyIGRealtime}x Story IG Takeover realtime`);
  if (tier.storyIGCuts)
    features.push(`${tier.storyIGCuts}x Story IG Cut to Cut`);
  if (tier.videoHighlightCount)
    features.push(`${tier.videoHighlightCount}x Video Cinematic Highlight`);
  if (tier.videoWeddingTrendCount)
    features.push(`${tier.videoWeddingTrendCount}x Video Wedding Trend`);
  if (tier.unlimitedMomentVideo) features.push("Unlimited Moment Video");
  if (tier.cloudDrive) features.push(tier.cloudDrive);
  if (tier.onlineMeeting) features.push("1x Online Meeting (opsional)");
  return features.slice(0, 5);
}

export function WeddingContentCreatorSection() {
  return (
    <section className="bg-[#0f0f0f] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] font-medium mb-3">
              Konten Pernikahan untuk Instagram
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#faf8f5] mb-4">
              Wedding Content Creator
            </h2>
            <p className="text-sm text-[#8a8a8a] max-w-2xl mx-auto leading-relaxed">
              Capture dan bagikan momen pernikahan Anda secara realtime di Instagram.
              Sameday edit, siap upload hari yang sama.
            </p>
          </div>
        </ScrollReveal>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5 items-stretch">
          {orderedTiers.map((tier, i) => {
            const keyFeatures = getKeyFeatures(tier);
            const isGold = tier.id === "gold";

            return (
              <ScrollReveal key={tier.id} delay={i * 100}>
                <div
                  className={`
                    relative flex flex-col border transition-all duration-300 h-full
                    ${isGold
                      ? "border-[#c9a96e]/40 bg-gradient-to-b from-[#1a1408] to-[#0a0a0a]"
                      : "border-white/[0.07] bg-[#0a0a0a]"
                    }
                  `}
                  style={
                    isGold
                      ? { boxShadow: "0 0 40px rgba(201,169,110,0.08), 0 0 0 1px rgba(201,169,110,0.15)" }
                      : undefined
                  }
                >
                  {/* Top gold line for featured */}
                  {isGold && (
                    <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
                  )}

                  <div className="p-5 lg:p-6 flex flex-col flex-1">
                    {/* Badge Area (keeps heights aligned) */}
                    <div className="min-h-[20px] mb-2 flex items-center">
                      {tier.badge && (
                        <p className="text-[9px] tracking-[0.25em] uppercase text-[#c9a96e]">
                          {tier.badge}
                        </p>
                      )}
                    </div>

                    {/* Package label */}
                    <h3 className="font-serif text-xl text-[#faf8f5] mb-1">
                      {tier.label}
                    </h3>

                    {/* Price + duration */}
                    <p className="text-[10px] text-[#c9a96e] font-medium leading-relaxed mb-4">
                      {formatIDR(tier.price)} / {tier.durationHours} jam
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.06] mb-4" />

                    {/* Suitable for (Event Package) */}
                    {tier.suitableFor && tier.suitableFor.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[9px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-2">
                          Cocok untuk
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {tier.suitableFor.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="text-[9px] px-2 py-0.5 border border-white/10 text-[#6a6a6a]"
                            >
                              {s}
                            </span>
                          ))}
                          {tier.suitableFor.length > 4 && (
                            <span className="text-[9px] text-[#6a6a6a]">+{tier.suitableFor.length - 4}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Key features */}
                    <div className="flex-1 mb-6 space-y-1.5">
                      {keyFeatures.map((feat) => (
                        <div key={feat} className="flex items-start gap-2">
                          <span className="text-[#c9a96e] text-xs mt-0.5 shrink-0">✓</span>
                          <span className="text-xs text-[#8a8a8a] leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href="/contact?service=content-creator"
                      className="block w-full py-2.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] transition-colors text-center mt-auto"
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom note */}
        <ScrollReveal delay={400}>
          <p className="text-center text-[11px] text-[#6a6a6a] mt-8 leading-relaxed">
            Harga per session. Tersedia untuk akad, resepsi, siraman, dan event lainnya.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
