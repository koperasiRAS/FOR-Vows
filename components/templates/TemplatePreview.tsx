"use client";

import { getTemplateBySlug } from "@/lib/templates";

interface TemplatePreviewProps {
  slug: string;
}

export function TemplatePreview({ slug }: TemplatePreviewProps) {
  const template = getTemplateBySlug(slug);

  if (!template) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center space-y-3">
          <p className="text-[#c9a96e] font-serif text-xl">Preview Tidak Tersedia</p>
          <p className="text-[#6a6a6a] text-sm">
            Template "{slug}" belum memiliki preview visual.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#0a0a0a] overflow-y-auto">
      {/* Simulated mobile/desktop invitation card */}
      <div className="min-h-full flex items-start justify-center p-6 sm:p-10">
        <div
          className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: `linear-gradient(160deg, ${template.gradientFrom} 0%, ${template.gradientTo} 100%)`,
          }}
        >
          {/* Header section */}
          <div className="relative px-8 pt-12 pb-8 text-center">
            {/* Decorative top ornament */}
            <div
              className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 border opacity-20 rotate-45"
              style={{ borderColor: template.accentColor }}
            />
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-6">
              Wedding Invitation
            </p>

            {/* Couple names */}
            <div className="space-y-2 mb-8">
              <p
                className="font-serif text-2xl italic text-white/90"
                style={{ color: template.accentColor }}
              >
                {template.name}
              </p>
              <div
                className="w-12 h-px mx-auto opacity-40"
                style={{ background: template.accentColor }}
              />
              <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase">
                to
              </p>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <p className="text-white/80 text-[11px] tracking-[0.15em] uppercase">
                Sabtu, 14 Juni 2025
              </p>
              <p className="text-white/50 text-[10px] tracking-widest uppercase">
                Pukul 19.00 WIB
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px opacity-20"
            style={{ background: template.accentColor }}
          />

          {/* Body section */}
          <div className="px-8 py-8 space-y-6 text-center">
            {/* Venue */}
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase">Lokasi</p>
              <p className="text-white/70 text-xs">Hotel Indonesia Kempinski</p>
              <p className="text-white/40 text-[10px]">Jakarta, Indonesia</p>
            </div>

            {/* RSVP placeholder */}
            <div className="border border-white/10 rounded-lg p-4 space-y-2">
              <p className="text-[10px] tracking-[0.15em] uppercase text-white/30">
                RSVP
              </p>
              <div className="flex justify-center gap-3">
                <div className="h-8 w-20 rounded bg-white/10 flex items-center justify-center">
                  <span className="text-white/50 text-[9px]">Hadir</span>
                </div>
                <div className="h-8 w-20 rounded bg-white/10 flex items-center justify-center">
                  <span className="text-white/50 text-[9px]">Maaf</span>
                </div>
              </div>
            </div>

            {/* Bottom ornament */}
            <div className="flex justify-center">
              <div
                className="w-10 h-10 border opacity-20 rotate-45"
                style={{ borderColor: template.accentColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fallback notice */}
      <div className="text-center pb-6 px-4">
        <p className="text-[#4a4a4a] text-[10px] tracking-wide">
          Preview sesungguhnya akan segera tersedia.{" "}
          <a href="/contact" className="text-[#c9a96e] hover:underline">
            Hubungi kami
          </a>{" "}
          untuk walkthrough personal.
        </p>
      </div>
    </div>
  );
}
