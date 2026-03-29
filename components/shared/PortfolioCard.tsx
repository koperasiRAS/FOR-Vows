import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { PortfolioItem } from "@/types";

const categoryLabels: Record<string, string> = {
  luxury: "Luxury",
  adat: "Adat",
  modern: "Modern",
  intimate: "Intimate",
};

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <Link
      href={`/templates/${item.slug || item.id}`}
      className="group relative flex flex-col overflow-hidden bg-[#141414] border border-white/[0.06] hover:border-[#c9a96e]/30 transition-all duration-500"
    >
      {/* Preview */}
      <div className="aspect-[3/4] relative overflow-hidden shrink-0">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{
            background: `linear-gradient(160deg, ${item.gradientFrom} 0%, ${item.gradientTo} 100%)`,
          }}
        />
        {/* Ornament */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border border-white/10 rotate-45" />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-xs tracking-[0.2em] uppercase text-white border border-white/40 px-5 py-2.5 backdrop-blur-sm flex items-center gap-2">
            Lihat Preview
            <ExternalLink size={12} />
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base text-[#faf8f5] group-hover:text-[#c9a96e] transition-colors">
            {item.title}
          </h3>
          <span className="text-[10px] tracking-[0.1em] uppercase text-[#6a6a6a]">
            {categoryLabels[item.category]}
          </span>
        </div>
        <p className="text-xs text-[#5a5a5a]">{item.description}</p>
      </div>
    </Link>
  );
}
