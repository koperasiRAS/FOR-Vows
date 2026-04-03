"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ExternalLink } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";
import { WA_NUMBER } from "@/lib/config";
import { templates } from "@/lib/templates";
import type { Language } from "@/lib/i18n/translations";

type Tab = "all" | "undangan" | "foto" | "video" | "content";

interface PortfolioPageProps {
  t: {
    overline: string;
    title: string;
    subtitle: string;
    note: string;
    ctaOverline: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaMulai: string;
    ctaLihat: string;
    tabAll: string;
    tabUndangan: string;
    tabFoto: string;
    tabVideo: string;
    tabContent: string;
    fotoTitle: string;
    fotoSubtitle: string;
    fotoComingSoon: string;
    fotoCta: string;
    videoTitle: string;
    videoSubtitle: string;
    videoComingSoon: string;
    videoCta: string;
    contentTitle: string;
    contentSubtitle: string;
    contentComingSoon: string;
    contentCta: string;
  };
}

const TABS: { id: Tab; labelKey: keyof PortfolioPageProps["t"] }[] = [
  { id: "all", labelKey: "tabAll" },
  { id: "undangan", labelKey: "tabUndangan" },
  { id: "foto", labelKey: "tabFoto" },
  { id: "video", labelKey: "tabVideo" },
  { id: "content", labelKey: "tabContent" },
];

// Placeholder wedding photo data
const FOTO_ITEMS = [
  { id: "f1", name: "Rangga & Vina", date: "15 Jun 2025", location: "Jakarta", gradientFrom: "#1a1206", gradientTo: "#735c00" },
  { id: "f2", name: "Arya & Devi", date: "22 Jul 2025", location: "Bali", gradientFrom: "#1a2e1a", gradientTo: "#4a7c59" },
  { id: "f3", name: "Bima & Sari", date: "08 Agt 2025", location: "Yogyakarta", gradientFrom: "#2c1810", gradientTo: "#8c4a4a" },
  { id: "f4", name: "Dimas & Lina", date: "30 Sep 2025", location: "Bandung", gradientFrom: "#1a1a2e", gradientTo: "#4a4a8c" },
  { id: "f5", name: "Fajar & Anisa", date: "12 Okt 2025", location: "Surabaya", gradientFrom: "#2e1a1a", gradientTo: "#7c4a4a" },
  { id: "f6", name: "Gede & Nila", date: "25 Nov 2025", location: "Semarang", gradientFrom: "#1a2e2e", gradientTo: "#4a7c7c" },
];

// Placeholder content creator portfolio
const CONTENT_ITEMS = [
  { id: "c1", name: "Wedding Reel — Jakarta", platform: "Instagram Reels", gradientFrom: "#2e1a1a", gradientTo: "#8c4a4a" },
  { id: "c2", name: "Ceremony Highlight — Bali", platform: "Instagram Reels", gradientFrom: "#1a2e1a", gradientTo: "#4a7c59" },
  { id: "c3", name: "Reception Vibes — Bandung", platform: "Instagram Reels", gradientFrom: "#1a1206", gradientTo: "#735c00" },
  { id: "c4", name: "First Dance — Surabaya", platform: "Instagram Reels", gradientFrom: "#1a1a2e", gradientTo: "#4a4a8c" },
];

function UndanganCard({ template, lang }: { template: (typeof templates)[number]; lang: Language }) {
  const catMap: Record<string, string> = { luxury: "Luxury", adat: "Adat", modern: "Modern", intimate: "Intimate" };
  const catLabel = catMap[template.category] ?? template.category;
  const catColor = template.accentColor ?? "#c9a96e";

  return (
    <Link
      href={`/order?package=premium`}
      className="group relative block overflow-hidden rounded-xl aspect-[3/4] bg-[#141414]"
    >
      {/* Thumbnail or gradient */}
      {template.thumbnailUrl ? (
        <Image
          src={template.thumbnailUrl}
          alt={template.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{ background: `linear-gradient(160deg, ${template.gradientFrom} 0%, ${template.gradientTo} 100%)` }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Category badge */}
      <div className="absolute top-3 left-3">
        <span
          className="text-[10px] tracking-widest uppercase px-2.5 py-1 backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.5)", color: catColor, border: `1px solid ${catColor}40` }}
        >
          {catLabel}
        </span>
      </div>

      {/* Info bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="font-serif text-lg text-white group-hover:text-[#c9a96e] transition-colors leading-snug">
          {template.name}
        </h3>
        <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{template.shortDescription}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#c9a96e] text-[#0a0a0a] text-[10px] tracking-widest uppercase font-medium">
            {lang === "id" ? "Pesan" : "Order"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function FotoCard({ item }: { item: (typeof FOTO_ITEMS)[number] }) {
  return (
    <div className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-[#141414] cursor-default">
      {/* Gradient bg as placeholder */}
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        style={{ background: `linear-gradient(160deg, ${item.gradientFrom} 0%, ${item.gradientTo} 100%)` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Decorative frame */}
      <div className="absolute inset-4 border border-white/10 pointer-events-none" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <h3 className="font-serif text-lg text-white">{item.name}</h3>
        <p className="text-white/60 text-xs mt-1">{item.date}</p>
        <p className="text-white/40 text-[10px] mt-0.5">{item.location}</p>
      </div>
    </div>
  );
}

function VideoCard({ title, subtitle, lang }: { title: string; subtitle: string; lang: "id" | "en" }) {
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo FOR Vows! Saya tertarik dengan portfolio video wedding. Bisa lihat contoh karyanya?`)}`;

  return (
    <div className="relative overflow-hidden rounded-xl aspect-video bg-[#0f0f0f] border border-white/[0.07] flex flex-col items-center justify-center gap-4 p-8 text-center">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1206]/50 to-transparent pointer-events-none" />

      {/* Play button */}
      <div className="relative w-16 h-16 rounded-full border border-[#c9a96e]/30 flex items-center justify-center">
        <Play size={24} className="text-[#c9a96e] ml-1" fill="#c9a96e" />
      </div>

      {/* Coming soon text */}
      <div className="relative">
        <h3 className="font-serif text-lg text-[#faf8f5] mb-1">{title}</h3>
        <p className="text-[#6a6a6a] text-xs max-w-[200px] mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* CTA */}
      <div className="relative mt-2">
        <WhatsAppButton
          as="a"
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          label={lang === "id" ? "Tanya via WhatsApp" : "Ask via WhatsApp"}
          className="w-auto px-6 py-3"
          size={14}
        />
      </div>
    </div>
  );
}

function ContentCreatorCard({ item }: { item: (typeof CONTENT_ITEMS)[number] }) {
  return (
    <div className="group relative overflow-hidden rounded-xl aspect-square bg-[#141414]">
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        style={{ background: `linear-gradient(160deg, ${item.gradientFrom} 0%, ${item.gradientTo} 100%)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

      {/* IG badge */}
      <div className="absolute top-3 left-3">
        <span className="text-[9px] tracking-widest uppercase px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">
          IG Reels
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="font-serif text-base text-white leading-snug">{item.name}</h3>
        <p className="text-white/50 text-[10px] mt-0.5">{item.platform}</p>
      </div>
    </div>
  );
}

export function PortfolioPage({ t }: PortfolioPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const showAll = activeTab === "all";
  const showUndangan = showAll || activeTab === "undangan";
  const showFoto = showAll || activeTab === "foto";
  const showVideo = showAll || activeTab === "video";
  const showContent = showAll || activeTab === "content";

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-10 text-center">
        <ScrollReveal>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] mb-4">{t.overline}</h2>
          <h1 className="font-serif text-3xl lg:text-4xl text-[#faf8f5] mb-4">{t.title}</h1>
          <p className="text-[#6a6a6a] text-sm leading-relaxed max-w-xl mx-auto">{t.subtitle}</p>
        </ScrollReveal>
      </div>

      {/* Tab Filter */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <ScrollReveal>
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 text-[11px] tracking-widest uppercase rounded-full border transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#c9a96e] text-[#0a0a0a] border-[#c9a96e] font-medium"
                    : "border-white/15 text-[#6a6a6a] hover:border-[#c9a96e]/40 hover:text-[#c9a96e]"
                }`}
              >
                {t[tab.labelKey]}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">

        {/* ── Undangan Digital ── */}
        {(showAll || activeTab === "undangan") && (
          <section>
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="font-serif text-2xl text-[#faf8f5] mb-2">{t.tabUndangan}</h2>
                <div className="w-12 h-px bg-[#c9a96e]/30 mx-auto" />
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {templates.map((template, i) => (
                <ScrollReveal key={template.id} delay={i * 60}>
                  <UndanganCard template={template} lang="id" />
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={200}>
              <div className="text-center mt-8">
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#c9a96e] hover:text-[#d4b87a] border-b border-[#c9a96e]/30 hover:border-[#c9a96e] pb-0.5 transition-colors"
                >
                  {t.ctaLihat}
                  <ExternalLink size={12} />
                </Link>
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* ── Foto Pernikahan ── */}
        {(showAll || activeTab === "foto") && (
          <section>
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="font-serif text-2xl text-[#faf8f5] mb-2">{t.fotoTitle}</h2>
                <p className="text-[#6a6a6a] text-sm mb-3">{t.fotoSubtitle}</p>
                <div className="w-12 h-px bg-[#c9a96e]/30 mx-auto" />
              </div>
            </ScrollReveal>

            {/* Coming soon grid — gradient cards as placeholders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FOTO_ITEMS.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 80}>
                  <FotoCard item={item} />
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={200}>
              <div className="text-center mt-8">
                <WhatsAppButton
                  as="a"
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo FOR Vows! Saya tertarik dengan paket Foto & Video Wedding. Boleh info lebih lanjut?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  label={t.fotoCta}
                  className="w-auto px-8"
                />
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* ── Video Wedding ── */}
        {(showAll || activeTab === "video") && (
          <section>
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="font-serif text-2xl text-[#faf8f5] mb-2">{t.videoTitle}</h2>
                <p className="text-[#6a6a6a] text-sm mb-3">{t.videoSubtitle}</p>
                <div className="w-12 h-px bg-[#c9a96e]/30 mx-auto" />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <VideoCard
                    title={t.videoComingSoon}
                    subtitle="Portfolio video segera hadir. Hubungi kami untuk melihat karya terbaru."
                    lang="id"
                  />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ── Content Creator ── */}
        {(showAll || activeTab === "content") && (
          <section>
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="font-serif text-2xl text-[#faf8f5] mb-2">{t.contentTitle}</h2>
                <p className="text-[#6a6a6a] text-sm mb-3">{t.contentSubtitle}</p>
                <div className="w-12 h-px bg-[#c9a96e]/30 mx-auto" />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CONTENT_ITEMS.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 80}>
                  <ContentCreatorCard item={item} />
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={200}>
              <div className="text-center mt-8">
                <WhatsAppButton
                  as="a"
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo FOR Vows! Saya tertarik dengan Wedding Content Creator. Bisa info lebih lanjut?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  label={t.contentCta}
                  className="w-auto px-8"
                />
              </div>
            </ScrollReveal>
          </section>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-2xl mx-auto px-6 mt-20 text-center">
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3">{t.ctaOverline}</p>
          <h2 className="font-serif text-2xl lg:text-3xl text-[#faf8f5] mb-3">{t.ctaTitle}</h2>
          <p className="text-[#6a6a6a] text-sm mb-8">{t.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
            >
              {t.ctaMulai}
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase border border-white/15 text-[#8a8a8a] hover:border-white/30 transition-colors"
            >
              {t.ctaLihat}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
