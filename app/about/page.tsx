import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { CTASection } from "@/components/sections/CTASection";

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Brand Story */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="space-y-6">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e]">
                Our Story
              </p>
              <h1 className="font-serif text-4xl lg:text-5xl text-[#faf8f5] leading-tight">
                FOR Vows was born from a simple belief
              </h1>
              <div className="space-y-4 text-[#8a8a8a] leading-relaxed text-sm">
                <p>
                  A wedding invitation is not merely a formality — it is the first
                  breath of your celebration, the first moment your guests feel
                  the weight and the joy of what is to come. It deserves more than
                  a generic template.
                </p>
                <p>
                  FOR Vows was founded as the dedicated wedding division of{" "}
                  <span className="text-[#faf8f5]">Frame Of Rangga</span>, a
                  creative studio known for its editorial work in photography and
                  visual storytelling. From that lineage, we brought the same
                  rigor, taste, and devotion to the world of digital wedding
                  invitations.
                </p>
                <p>
                  Our name carries intention: <em>FOR</em> — in service of —{" "}
                  <em>Vows</em> — the sacred promises you make to each other. Every
                  invitation we create is a testament to that devotion.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="relative aspect-square overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1206] via-[#2d1f0a] to-[#1a1206]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-10">
                <div className="space-y-2">
                  <span className="text-xs tracking-[0.3em] uppercase text-[#c9a96e]/50">
                    A sub-brand of
                  </span>
                  <p className="font-serif text-2xl text-[#c9a96e]/60">
                    Frame Of Rangga
                  </p>
                </div>
                <div className="w-20 h-px bg-[#c9a96e]/20" />
                <div className="space-y-1">
                  <p className="font-serif italic text-4xl text-[#c9a96e]/40">
                    FOR
                  </p>
                  <p className="font-serif italic text-3xl text-[#c9a96e]/30">
                    Vows
                  </p>
                </div>
              </div>
              <div className="absolute inset-4 border border-[#c9a96e]/10 pointer-events-none" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#0f0f0f] mt-20 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              overline="Our Philosophy"
              title="What We Stand For"
              subtitle="Four principles that guide every invitation we create"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 lg:mt-16">
            {[
              {
                num: "01",
                title: "Intention Over Speed",
                description:
                  "We take the time to understand your story, your aesthetic, and your vision — then we create an invitation that could only be yours.",
              },
              {
                num: "02",
                title: "Guests First",
                description:
                  "Every decision — from typography to navigation — is made with your guests' experience in mind. An invitation should feel like an embrace.",
              },
              {
                num: "03",
                title: "Restrained Luxury",
                description:
                  "True elegance is not about excess. We believe in refined details, careful typography, and meaningful ornamentation — never clutter.",
              },
              {
                num: "04",
                title: "Technology in Service",
                description:
                  "Digital tools allow us to create something that paper never could — interactive, personal, alive. We use technology to deepen, not distract.",
              },
            ].map((value, i) => (
              <ScrollReveal key={value.num} delay={i * 80}>
                <div className="p-8 border border-white/[0.06] bg-[#0a0a0a] space-y-3">
                  <span className="text-xs font-mono text-[#c9a96e]/50">
                    {value.num}
                  </span>
                  <h3 className="font-serif text-lg text-[#faf8f5]">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#6a6a6a] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        overline="Work With Us"
        title="Ready to Create Something Beautiful?"
        subtitle="Let's talk about your wedding and craft an invitation worthy of your story."
        primaryCta={{ label: "Get in Touch", href: "/contact" }}
        secondaryCta={{ label: "View Templates", href: "/templates" }}
      />
    </div>
  );
}
