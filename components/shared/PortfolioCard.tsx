import Link from "next/link";
import Image from "next/image";
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
      href={`/templates/${item.slug}`}
      className="group relative block overflow-hidden rounded-xl aspect-[3/4] bg-[#141414] cursor-pointer"
    >
      {/* Image with gradient fallback */}
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        style={{
          background: item.thumbnailUrl ? undefined : `linear-gradient(160deg, ${item.gradientFrom} 0%, ${item.gradientTo} 100%)`,
        }}
      >
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.coupleName ?? item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          /* Ornament fallback */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border border-white/10 rotate-45" />
          </div>
        )}
      </div>

      {/* Gradient overlay — always present but darkens on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
          opacity-80 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Category badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full tracking-wide">
          {categoryLabels[item.category]}
        </span>
      </div>

      {/* Hover overlay content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white font-semibold text-sm">
          {item.coupleName ?? item.title}
        </p>
        <p className="text-white/70 text-xs mt-0.5">{item.title}</p>
        {(item.location || item.date) && (
          <p className="text-white/50 text-xs mt-1">
            {[item.location, item.date].filter(Boolean).join(" · ")}
          </p>
        )}
        {item.testimonial && (
          <p className="text-white/60 text-xs mt-2 italic line-clamp-2 leading-relaxed">
            &ldquo;{item.testimonial}&rdquo;
          </p>
        )}
        <span className="mt-3 text-amber-400 text-xs hover:text-amber-300 transition-colors flex items-center gap-1">
          Lihat Template
          <ExternalLink size={10} />
        </span>
      </div>
    </Link>
  );
}
