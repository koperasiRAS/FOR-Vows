import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { HowItWorksStep as HowItWorksStepType } from "@/types";

interface HowItWorksStepProps {
  step: HowItWorksStepType;
  last?: boolean;
}

export function HowItWorksStep({ step, last = false }: HowItWorksStepProps) {
  const IconComponent: LucideIcon =
    (LucideIcons as unknown as Record<string, LucideIcon>)[step.icon] || LucideIcons.Star;

  return (
    <div className="flex gap-6 lg:gap-8">
      {/* Number + Line */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border border-[#c9a96e]/30 bg-[#0f0f0f] flex items-center justify-center shrink-0">
          <span className="text-xs font-medium text-[#c9a96e] tracking-wider">
            {step.number}
          </span>
        </div>
        {!last && (
          <div className="w-px flex-1 min-h-8 bg-gradient-to-b from-[#c9a96e]/30 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className="pb-10 lg:pb-12 space-y-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-[#c9a96e]">
            <IconComponent size={16} />
          </div>
          <h3 className="font-serif text-lg text-[#faf8f5]">{step.title}</h3>
        </div>
        <p className="text-sm text-[#8a8a8a] leading-relaxed max-w-md">
          {step.description}
        </p>
      </div>
    </div>
  );
}
