import Link from "next/link";

interface CTASectionProps {
  overline?: string;
  title: string;
  subtitle?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function CTASection({
  overline = "Ready to Begin",
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: CTASectionProps) {
  return (
    <section className="bg-[#0f0f0f] border-y border-white/[0.05]">
      <div className="max-w-5xl mx-auto px-6 py-20 lg:py-28 flex flex-col items-center text-center gap-6">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] font-medium">
          {overline}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#faf8f5] max-w-3xl leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base text-[#8a8a8a] max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link
            href={primaryCta.href}
            className="px-10 py-4 text-[11px] tracking-[0.2em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] hover:shadow-[0_0_30px_rgba(201,169,110,0.25)] transition-all duration-300"
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="px-10 py-4 text-[11px] tracking-[0.2em] uppercase border border-white/20 text-[#faf8f5] hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
