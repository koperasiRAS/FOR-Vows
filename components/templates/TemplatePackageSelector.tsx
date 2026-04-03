"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PACKAGES, type PackageKey } from "@/lib/packages";

interface TemplatePackageSelectorProps {
  templateSlug: string;
}

export function TemplatePackageSelector({ templateSlug }: TemplatePackageSelectorProps) {
  const [selected, setSelected] = useState<PackageKey>("premium");

  const selectedPkg = PACKAGES.find((p) => p.key === selected) ?? PACKAGES[1];

  return (
    <div className="space-y-4">
      {/* Package tabs */}
      <div className="grid grid-cols-3 gap-2">
        {PACKAGES.map((pkg) => (
          <button
            key={pkg.key}
            type="button"
            onClick={() => setSelected(pkg.key)}
            className={`relative p-4 border text-center transition-all duration-200 ${
              selected === pkg.key
                ? "border-[#c9a96e] bg-[#c9a96e]/8"
                : "border-white/8 bg-[#141414] hover:border-white/20"
            }`}
          >
            {pkg.featured && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] uppercase bg-[#c9a96e] text-[#0a0a0a] px-2 py-0.5 whitespace-nowrap">
                Populer
              </span>
            )}
            <p className="font-serif text-sm text-[#faf8f5] mb-0.5">{pkg.label}</p>
            <p className="text-sm font-medium text-[#c9a96e]">{pkg.priceLabel}</p>
            {selected === pkg.key && (
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#c9a96e] flex items-center justify-center">
                <Check size={9} className="text-[#0a0a0a]" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* CTA — updates with selected package */}
      <Link
        href={`/order?template=${templateSlug}&package=${selected}`}
        className="flex items-center justify-center gap-2 w-full py-3.5 text-[11px] tracking-[0.18em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-all duration-300"
      >
        Pilih Paket {selectedPkg.label}
        <span className="opacity-70">—</span>
        {selectedPkg.priceLabel}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
