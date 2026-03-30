"use client";

import { useState } from "react";
import { ExternalLink, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { WeddingTemplate } from "@/types";

interface PreviewButtonProps {
  template: WeddingTemplate;
  translatedName?: string;
}

export function PreviewButton({ template, translatedName }: PreviewButtonProps) {
  const { t } = useLanguage();
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <button
        className="flex items-center justify-center gap-2 w-full py-3.5 text-[11px] tracking-[0.18em] uppercase border border-white/15 text-[#faf8f5] hover:border-white/30 hover:bg-white/5 transition-all duration-300"
        onClick={() => setPreviewOpen(true)}
      >
        <ExternalLink size={13} />
        {t("preview.previewLiveDemo")}
      </button>

      {/* Preview Modal */}
      {previewOpen && (
        <PreviewModal
          template={template}
          translatedName={translatedName}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

// ── Preview Modal ──────────────────────────────────────────────────────────────

function PreviewModal({
  template,
  translatedName,
  onClose,
}: {
  template: WeddingTemplate;
  translatedName?: string;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[210] flex flex-col items-center justify-center p-6">
        {/* Controls */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-white/60 text-xs font-mono w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Invitation Preview */}
        <div
          className="w-full max-w-sm aspect-[3/4] rounded-sm overflow-hidden shadow-2xl transform transition-transform duration-300"
          style={{
            transform: `scale(${zoom})`,
            background: `linear-gradient(160deg, ${template.gradientFrom} 0%, ${template.gradientTo} 100%)`,
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-6 opacity-60" style={{ color: template.accentColor }}>
              Save the Date
            </p>
            <h2 className="font-serif italic text-3xl mb-4 leading-tight" style={{ color: template.accentColor }}>
              {translatedName ?? template.name}
            </h2>
            <div className="w-12 h-px mb-4 opacity-40" style={{ background: template.accentColor }} />
            <p className="text-[10px] tracking-[0.2em] uppercase mb-2 opacity-60" style={{ color: template.accentColor }}>
              Saturday, June 14th
            </p>
            <p className="font-serif italic text-lg opacity-80" style={{ color: template.accentColor }}>
              The Grand Ballroom
            </p>
            {/* Ornament */}
            <div className="mt-auto pt-8">
              <div
                className="w-16 h-16 border rotate-45 mx-auto opacity-20"
                style={{ borderColor: template.accentColor }}
              />
            </div>
          </div>
        </div>

        <p className="mt-6 text-white/40 text-xs tracking-wide text-center">
          This is a preview of your digital invitation. Final design may vary based on package.
        </p>
      </div>
    </>
  );
}
