import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { HowItWorksStep } from "@/components/shared/HowItWorksStep";
import { CTASection } from "@/components/sections/CTASection";
import { howItWorksSteps } from "@/lib/templates";

export default function HowItWorksPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline="The Journey"
            title="From Vision to Published Invitation"
            subtitle="A seamless, thoughtful process designed so you can focus on celebrating — while we handle the invitation."
          />
        </ScrollReveal>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="border-l border-[#c9a96e]/10 pl-8 lg:pl-12">
          {howItWorksSteps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 100}>
              <HowItWorksStep step={step} last={i === howItWorksSteps.length - 1} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Timeline note */}
      <ScrollReveal delay={500}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 mt-12">
          <div className="p-6 border border-white/[0.06] bg-[#0f0f0f] grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center space-y-1">
              <p className="font-serif text-2xl text-[#c9a96e]">5–7</p>
              <p className="text-xs text-[#6a6a6a]">Business days delivery</p>
            </div>
            <div className="text-center space-y-1 border-x border-white/[0.06]">
              <p className="font-serif text-2xl text-[#c9a96e]">1</p>
              <p className="text-xs text-[#6a6a6a]">Free revision round included</p>
            </div>
            <div className="text-center space-y-1">
              <p className="font-serif text-2xl text-[#c9a96e]">48h</p>
              <p className="text-xs text-[#6a6a6a]">Fast-track option available</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <CTASection
        overline="Ready to Begin?"
        title="Your Perfect Invitation Is Five Steps Away"
        subtitle="Start with choosing a template that speaks to your heart."
        primaryCta={{ label: "View Templates", href: "/templates" }}
        secondaryCta={{ label: "Contact Us", href: "/contact" }}
      />
    </div>
  );
}
