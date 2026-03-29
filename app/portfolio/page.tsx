import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PortfolioCard } from "@/components/shared/PortfolioCard";
import { CTASection } from "@/components/sections/CTASection";
import { portfolioItems } from "@/lib/templates";

export default function PortfolioPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline="Our Work"
            title="Selected Invitations"
            subtitle="A curated selection of our work — each one a unique celebration captured in digital form."
          />
        </ScrollReveal>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {portfolioItems.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 60}>
              <PortfolioCard item={item} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Note */}
      <ScrollReveal delay={300}>
        <div className="max-w-2xl mx-auto px-6 mt-12 text-center">
          <p className="text-xs text-[#5a5a5a] leading-relaxed">
            Each invitation is custom-crafted for its couple. To see a live demo
            of any template, contact us and we&apos;ll arrange a personal walkthrough.
          </p>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <CTASection
        overline="Create Yours"
        title="Your Invitation Could Be Next"
        subtitle="Join the couples who chose FOR Vows for their most important celebration."
        primaryCta={{ label: "Start Your Invitation", href: "/contact" }}
        secondaryCta={{ label: "View Templates", href: "/templates" }}
      />
    </div>
  );
}
