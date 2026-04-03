"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";
import { WEDDING_PHOTOGRAPHY } from "@/lib/constants/services";
import { WA_NUMBER } from "@/lib/config";
import { formatIDR } from "@/lib/utils";

const tiers = WEDDING_PHOTOGRAPHY.tiers;

function buildWaLink(packageLabel: string) {
  const msg = encodeURIComponent(
    `Halo FOR Vows! Saya tertarik dengan "${packageLabel}" Foto & Video Wedding. Bisa info lebih lanjut?`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

// Max 5 key features to show per card
function getKeyFeatures(tier: (typeof tiers)[number]) {
  const features: string[] = [];
  if (tier.videoIncluded) features.push(`Video cinematic ${tier.videoDuration}`);
  if (tier.albumIncluded && tier.albumDescription)
    features.push(tier.albumDescription);
  if (tier.photoPrint) features.push(tier.photoPrint);
  if (tier.flashDrive) features.push(tier.flashDrive);
  if (tier.cloudStorage) features.push(tier.cloudStorage);
  if (tier.crew) features.push(tier.crew);
  return features.slice(0, 5);
}

export function WeddingPhotographySection() {
  return (
    <section className="bg-[#141414] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] font-medium mb-3">
              Abadikan Momen
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#faf8f5] mb-4">
              Foto &amp; Video Wedding
            </h2>
            <p className="text-sm text-[#8a8a8a] max-w-2xl mx-auto leading-relaxed">
              Tim fotografer dan videografer profesional kami mengabadikan setiap
              momen pernikahan Anda dengan sentuhan sinematik.
            </p>
          </div>
        </ScrollReveal>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5 items-stretch">
          {tiers.map((tier, i) => {
            const keyFeatures = getKeyFeatures(tier);
            const isPaket1 = tier.id === "paket_1";
            const waLink = buildWaLink(tier.label);

            return (
              <ScrollReveal key={tier.id} delay={i * 100}>
                <div
                  className={`
                    relative flex flex-col border transition-all duration-300 h-full
                    ${isPaket1
                      ? "border-[#c9a96e]/40 bg-gradient-to-b from-[#1a1408] to-[#0f0f0f]"
                      : "border-white/[0.07] bg-[#0a0a0a]"
                    }
                  `}
                  style={
                    isPaket1
                      ? { boxShadow: "0 0 40px rgba(201,169,110,0.08), 0 0 0 1px rgba(201,169,110,0.15)" }
                      : undefined
                  }
                >
                  {/* Top gold line for featured */}
                  {isPaket1 && (
                    <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />
                  )}

                  <div className="p-5 lg:p-6 flex flex-col flex-1">
                    {/* Package label */}
                    <h3 className="font-serif text-xl text-[#faf8f5] mb-1">
                      {tier.label}
                    </h3>

                    {/* Price */}
                    <p className="text-[10px] text-[#c9a96e] font-medium leading-relaxed mb-4">
                      {formatIDR(tier.price)}
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.06] mb-4" />

                    {/* Meta: duration + photos */}
                    <div className="flex gap-3 mb-4">
                      <span className="text-[10px] text-[#6a6a6a]">
                        {tier.durationHours} jam
                      </span>
                      <span className="text-[10px] text-[#6a6a6a]">·</span>
                      <span className="text-[10px] text-[#6a6a6a]">
                        {tier.photoCount} foto
                      </span>
                      {tier.videoIncluded && (
                        <>
                          <span className="text-[10px] text-[#6a6a6a]">·</span>
                          <span className="text-[10px] text-[#6a6a6a]">Video</span>
                        </>
                      )}
                    </div>

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
                    <WhatsAppButton
                      as="a"
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      label="Tanya via WhatsApp"
                      className="mt-auto"
                    />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Portfolio link */}
        <ScrollReveal delay={400}>
          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#c9a96e] hover:text-[#d4b87a] transition-colors border-b border-[#c9a96e]/30 hover:border-[#c9a96e] pb-0.5"
            >
              Lihat Portfolio Foto
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                <path d="M1 4h14M10 1l4 3-4 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
