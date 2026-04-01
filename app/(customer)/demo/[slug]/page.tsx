"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShoppingBag, Monitor, Smartphone } from "lucide-react";
import { FloralLuxuryTemplate } from "@/components/templates/floral-luxury";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { getTemplateBySlug } from "@/lib/templates";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function DemoSandboxPage({ params }: Props) {
  const { slug } = use(params);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const template = getTemplateBySlug(slug);
  const templateName = template?.name ?? slug;

  return (
    <div className="flex flex-col h-screen bg-[#050505] overflow-hidden text-[#faf8f5] font-sans">
      {/* Demo Toolbar — always visible, sits above all content */}
      <header className="relative z-[9999] shrink-0 h-12 flex items-center justify-between px-4 lg:px-6 bg-black/85 backdrop-blur-md border-b border-white/10">
        <Link
          href={`/templates/${slug}`}
          className="flex items-center gap-2 text-xs tracking-wide text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={13} />
          <span className="hidden sm:inline">Kembali ke Detail</span>
          <span className="sm:hidden">← Detail</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1 bg-[#1a1a1a] rounded-full px-1 py-0.5 border border-white/5">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded-full transition-colors ${
              device === "desktop"
                ? "bg-[#2a2a2a] text-[#c9a96e]"
                : "text-[#5a5a5a] hover:text-[#8a8a8a]"
            }`}
            title="Desktop view"
          >
            <Monitor size={14} />
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded-full transition-colors ${
              device === "mobile"
                ? "bg-[#2a2a2a] text-[#c9a96e]"
                : "text-[#5a5a5a] hover:text-[#8a8a8a]"
            }`}
            title="Mobile view"
          >
            <Smartphone size={14} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/t/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            title="Open standalone"
          >
            <ExternalLink size={13} />
          </a>
          <Link
            href={`/order?template=${slug}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-full hover:bg-[#d4b87a] transition-colors"
          >
            <ShoppingBag size={11} />
            <span className="hidden sm:inline">Pesan Template</span>
            <span className="sm:hidden">Pesan</span>
          </Link>
        </div>
      </header>

      {/* Template name badge — shown on mobile when desktop view selected */}
      {device === "desktop" && (
        <div className="sm:hidden shrink-0 px-4 py-2 bg-[#0a0a0a] border-b border-white/5 text-center">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
            Preview · {templateName}
          </span>
        </div>
      )}

      {/* Preview Area */}
      <main className="flex-1 relative flex items-start sm:items-center justify-center overflow-hidden">
        {slug === "floral-luxury" ? (
          /* Render the actual React template component directly — no iframe */
          <div
            className={`w-full overflow-auto transition-all duration-500 ${
              device === "mobile"
                ? "max-w-[375px] mx-auto h-full rounded-b-3xl ring-1 ring-white/10"
                : "h-full"
            }`}
          >
            <FloralLuxuryTemplate />
          </div>
        ) : (
          /* TemplatePreview already handles its own layout, wrap in device frame */
          <div
            className={`w-full overflow-hidden transition-all duration-500 ${
              device === "mobile"
                ? "max-w-[375px] h-full rounded-b-3xl ring-1 ring-white/10"
                : "h-full"
            }`}
          >
            <TemplatePreview slug={slug} />
          </div>
        )}
      </main>
    </div>
  );
}
