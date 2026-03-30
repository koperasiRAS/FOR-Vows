"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Mail, Globe, BookOpen, Video, Palette, Bell } from "lucide-react";

const SERVICES = [
  {
    key: "comingSoon1" as const,
    Icon: Globe,
  },
  {
    key: "comingSoon2" as const,
    Icon: BookOpen,
  },
  {
    key: "comingSoon3" as const,
    Icon: Video,
  },
  {
    key: "comingSoon4" as const,
    Icon: Palette,
  },
];

export function ComingSoonSection() {
  const { t, lang } = useLanguage();
  const home = t as Record<string, Record<string, string>>;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate API call — integrate with your email service as needed
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <section className="bg-[#0f0f0f] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            overline={home.home?.comingSoonOverline}
            title={home.home?.comingSoonTitle}
            subtitle={home.home?.comingSoonSubtitle}
          />
        </ScrollReveal>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14 lg:mt-16">
          {SERVICES.map(({ key, Icon }, i) => (
            <ScrollReveal key={key} delay={i * 80}>
              <div className="flex flex-col items-start p-6 border border-white/[0.07] bg-[#0a0a0a] hover:border-[#c9a96e]/20 transition-all duration-300 group">
                {/* Coming soon badge */}
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#c9a96e]/5 border border-[#c9a96e]/15 flex items-center justify-center text-[#c9a96e]/60 group-hover:text-[#c9a96e] group-hover:bg-[#c9a96e]/10 transition-colors">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] tracking-[0.15em] uppercase text-[#c9a96e]/40 border border-[#c9a96e]/20 px-2 py-0.5 rounded-sm">
                    Soon
                  </span>
                </div>

                <h3 className="text-sm font-medium text-[#faf8f5] mb-2 leading-snug">
                  {home.home?.[`${key}Title` as keyof typeof home.home]}
                </h3>
                <p className="text-xs text-[#6a6a6a] leading-relaxed">
                  {home.home?.[`${key}Desc` as keyof typeof home.home]}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Notify me form */}
        <ScrollReveal delay={400}>
          <div className="mt-14 max-w-md mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <Bell size={14} className="text-[#c9a96e]" />
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e]">
                {lang === "id" ? "Ikuti Perkembangan" : "Stay Updated"}
              </p>
            </div>

            {submitted ? (
              <p className="text-sm text-[#c9a96e] leading-relaxed">
                {home.home?.comingSoonSuccess}
              </p>
            ) : (
              <form onSubmit={handleNotify} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={home.home?.comingSoonEmailPlaceholder}
                  required
                  className="flex-1 bg-[#0a0a0a] border border-white/[0.08] text-[#faf8f5] text-sm px-4 py-2.5 placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] disabled:opacity-50 transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                  ) : (
                    <Mail size={13} />
                  )}
                  {home.home?.comingSoonNotify}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
