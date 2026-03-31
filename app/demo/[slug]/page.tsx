"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, Smartphone, ExternalLink, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function DemoSandboxPage({ params }: Props) {
  const { slug } = use(params);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col h-screen bg-[#050505] overflow-hidden text-[#faf8f5] font-sans">
      {/* Top Bar */}
      <header className="h-14 shrink-0 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-4 lg:px-6 z-10">
        <div className="flex items-center gap-4 flex-1">
          <Link
            href={`/templates/${slug}`}
            className="flex items-center gap-2 text-xs tracking-wide text-[#8a8a8a] hover:text-[#c9a96e] transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back to detail</span>
          </Link>
        </div>

        {/* Device Toggle */}
        <div className="hidden sm:flex items-center bg-[#141414] rounded-full p-1 border border-white/5 mx-auto">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded-full transition-colors ${
              device === "desktop" ? "bg-[#2a2a2a] text-[#c9a96e]" : "text-[#6a6a6a] hover:text-[#8a8a8a]"
            }`}
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded-full transition-colors ${
              device === "mobile" ? "bg-[#2a2a2a] text-[#c9a96e]" : "text-[#6a6a6a] hover:text-[#8a8a8a]"
            }`}
          >
            <Smartphone size={16} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 flex-1">
          <a
            href={`/t/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs text-[#8a8a8a] hover:text-[#c9a96e] transition-colors"
            title="Open in new tab"
          >
            <ExternalLink size={14} />
          </a>
          <Link
            href={`/order?template=${slug}`}
            className="flex items-center gap-2 px-4 py-2 text-[10px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
          >
            <ShoppingBag size={12} />
            <span className="hidden sm:inline">Order Template</span>
          </Link>
        </div>
      </header>

      {/* Iframe Container */}
      <main className="flex-1 bg-[#050505] relative flex items-center justify-center p-0 sm:p-4 lg:p-8 overflow-hidden">
        <div
          className={`relative bg-[#0a0a0a] transition-all duration-500 ease-in-out border border-white/10 shadow-2xl overflow-hidden
          ${
            device === "mobile"
              ? "w-full max-w-[375px] h-full sm:h-[812px] sm:rounded-[2rem] sm:border-[8px] sm:border-[#1a1a1a]"
              : "w-full h-full max-w-[1440px] rounded-sm"
          }`}
        >
          {device === "mobile" && (
            <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1a] rounded-b-xl z-20" />
          )}
          <iframe
            src={`/t/${slug}`}
            className="w-full h-full border-0 bg-transparent"
            title={`Preview of ${slug}`}
          />
        </div>
      </main>
    </div>
  );
}
