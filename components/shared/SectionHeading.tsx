import { memo } from "react";

interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export const SectionHeading = memo(function SectionHeading({
  overline,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`space-y-3 ${align === "center" ? "text-center" : ""}`}>
      {overline && (
        <p className="text-xs tracking-[0.3em] uppercase font-medium text-[#c9a96e]">
          {overline}
        </p>
      )}
      <h2
        className={`font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight ${
          light ? "text-[#1a1a1a]" : "text-[#faf8f5]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base leading-relaxed max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-[#5a5a5a]" : "text-[#8a8a8a]"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
});
