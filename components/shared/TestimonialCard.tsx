"use client";

import type { TestimonialItem } from "@/types";

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="p-8 border border-white/[0.06] bg-[#0f0f0f] space-y-5 relative min-h-[220px] flex flex-col">
      {/* Quote mark */}
      <div className="text-6xl font-serif text-[#c9a96e]/20 leading-none select-none absolute top-4 left-6">
        &ldquo;
      </div>

      <div className="space-y-4 pt-6 flex-1">
        <p className="text-sm text-[#9a9a9a] leading-relaxed italic font-accent">
          {testimonial.quote}
        </p>

        <div className="border-t border-white/[0.06] pt-4 space-y-1">
          <p className="text-sm font-medium text-[#faf8f5]">
            {testimonial.name}
          </p>
          <p className="text-xs text-[#6a6a6a]">
            {testimonial.weddingDate} &middot; {testimonial.package}
          </p>
        </div>
      </div>
    </div>
  );
}
