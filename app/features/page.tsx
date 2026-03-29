import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { FeatureCard } from "@/components/features/FeatureCard";
import { CTASection } from "@/components/sections/CTASection";
import { features } from "@/lib/templates";

export default function FeaturesPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline="Capabilities"
            title="Features That Matter"
            subtitle="Every element of your digital invitation is designed to create a seamless, elegant experience for you and your guests."
          />
        </ScrollReveal>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 60}>
              <FeatureCard feature={feature} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Additional Note */}
      <ScrollReveal delay={300}>
        <div className="max-w-2xl mx-auto px-6 mt-16 text-center">
          <p className="text-xs text-[#5a5a5a] leading-relaxed">
            All features are included based on your selected package. The
            Exclusive package includes every feature with full customization.
          </p>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <CTASection
        overline="Ready to Experience It?"
        title="See These Features in Action"
        subtitle="Choose a template and discover what a premium digital invitation can feel like."
        primaryCta={{ label: "Explore Templates", href: "/templates" }}
        secondaryCta={{ label: "View Pricing", href: "/pricing" }}
      />
    </div>
  );
}
