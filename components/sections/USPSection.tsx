"use client";

import { useLanguage } from "@/lib/i18n/context";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const USP_ITEMS = [
  {
    key: "usp1" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    key: "usp2" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    key: "usp3" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    key: "usp4" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
];

export function USPSection() {
  const { t } = useLanguage();
  const home = t as Record<string, Record<string, string>>;

  return (
    <section className="bg-[#0a0a0a] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            overline={home.home?.uspOverline}
            title={home.home?.uspTitle}
            subtitle={home.home?.uspSubtitle}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14 lg:mt-16">
          {USP_ITEMS.map((item, i) => (
            <ScrollReveal key={item.key} delay={i * 80}>
              <div className="flex flex-col items-center text-center p-6 border border-white/[0.07] bg-[#0f0f0f] hover:border-[#c9a96e]/20 transition-all duration-300 group">
                {/* Icon */}
                <div className="w-11 h-11 rounded-full bg-[#c9a96e]/5 border border-[#c9a96e]/15 flex items-center justify-center text-[#c9a96e] mb-4 group-hover:bg-[#c9a96e]/10 group-hover:border-[#c9a96e]/30 transition-colors">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-[#faf8f5] mb-2 leading-snug">
                  {home.home?.[`${item.key}Title` as keyof typeof home.home]}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#6a6a6a] leading-relaxed">
                  {home.home?.[`${item.key}Desc` as keyof typeof home.home]}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
