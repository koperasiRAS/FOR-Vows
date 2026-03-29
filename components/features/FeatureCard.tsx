import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FeatureItem } from "@/types";

interface FeatureCardProps {
  feature: FeatureItem;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const IconComponent: LucideIcon =
    (LucideIcons as unknown as Record<string, LucideIcon>)[feature.icon] || LucideIcons.Star;

  return (
    <div className="group p-6 border border-white/[0.06] bg-[#0f0f0f] hover:border-[#c9a96e]/20 hover:bg-[#141414] transition-all duration-400 flex flex-col gap-3 min-h-[160px]">
      <div className="w-10 h-10 flex items-center justify-center border border-[#c9a96e]/30 text-[#c9a96e] group-hover:bg-[#c9a96e]/10 transition-colors duration-300 shrink-0">
        <IconComponent size={18} />
      </div>
      <h3 className="font-serif text-base text-[#faf8f5] group-hover:text-[#c9a96e] transition-colors duration-300">
        {feature.title}
      </h3>
      <p className="text-sm text-[#6a6a6a] leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}
