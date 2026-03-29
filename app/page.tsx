import Link from "next/link";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { CTASection } from "@/components/sections/CTASection";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { HowItWorksStep } from "@/components/shared/HowItWorksStep";
import { templates, testimonials, howItWorksSteps } from "@/lib/templates";

const categories = [
  {
    name: "Luxury",
    description: "Grand, opulent designs for the celebration of a lifetime",
    href: "/templates?category=luxury",
    gradient: "from-[#1a1206] to-[#3d2e0f]",
    accent: "#c9a96e",
  },
  {
    name: "Adat",
    description: "Honoring tradition with culturally rich visual narratives",
    href: "/templates?category=adat",
    gradient: "from-[#2d1810] to-[#5c2e1a]",
    accent: "#d4a96e",
  },
  {
    name: "Modern",
    description: "Contemporary minimalism that speaks in clean, bold lines",
    href: "/templates?category=modern",
    gradient: "from-[#1a2e1a] to-[#2d4a28]",
    accent: "#8fbc8f",
  },
  {
    name: "Intimate",
    description: "Warm, personal designs for the most private of celebrations",
    href: "/templates?category=intimate",
    gradient: "from-[#1e0a12] to-[#3a1422]",
    accent: "#c97878",
  },
];

const valueProps = [
  {
    number: "01",
    title: "Premium Design Direction",
    description:
      "Every invitation is crafted with the sensibility of a high-end editorial studio — no templates, no compromises.",
  },
  {
    number: "02",
    title: "Thoughtful Guest Experience",
    description:
      "Your guests receive an invitation that feels personal, elegant, and effortless to navigate on any device.",
  },
  {
    number: "03",
    title: "Seamless RSVP Management",
    description:
      "Eliminate the chaos of spreadsheets. Track responses, dietary needs, and attendance in real time.",
  },
];

export default function HomePage() {
  const featuredTemplates = templates.filter((t) => t.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(201,169,110,0.04) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#c9a96e]/20 to-transparent" />
          <div className="absolute top-0 left-1/4 w-px h-16 bg-gradient-to-b from-transparent to-white/[0.03]" />
          <div className="absolute top-0 right-1/4 w-px h-16 bg-gradient-to-b from-transparent to-white/[0.03]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 pt-20">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] font-medium">
              A Premium Wedding Invitation Studio
            </p>
            <div className="w-16 h-px bg-[#c9a96e]/40 mx-auto" />
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight">
            <span className="block text-[#faf8f5]">Crafting Your</span>
            <span className="block mt-2">
              <span className="text-[#c9a96e] italic">Sacred</span>
              <span className="block text-[#faf8f5]"> Moments</span>
            </span>
          </h1>

          <p className="font-accent italic text-xl md:text-2xl text-[#8a8a8a] max-w-2xl mx-auto leading-relaxed">
            Premium digital wedding invitations that transform your celebration
            into a timeless, elegant experience — from FOR Vows.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/templates"
              className="px-10 py-4 text-[11px] tracking-[0.2em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] hover:shadow-[0_0_30px_rgba(201,169,110,0.25)] transition-all duration-300"
            >
              View Templates
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 text-[11px] tracking-[0.2em] uppercase border border-white/20 text-[#faf8f5] hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              Start Your Invitation
            </Link>
          </div>

          <p className="text-xs text-[#4a4a4a] tracking-wider pt-4">
            A sub-brand of{" "}
            <span className="text-[#6a6a6a]">Frame Of Rangga</span>
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#3a3a3a]">
            Scroll
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#3a3a3a]">
            <path d="M7 1v12M1 7l6 6 6-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="bg-[#0f0f0f] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              overline="Curated Collection"
              title="Featured Templates"
              subtitle="Handpicked invitation designs for the most discerning couples"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 lg:mt-16">
            {featuredTemplates.map((template, i) => (
              <ScrollReveal key={template.id} delay={i * 100}>
                <TemplateCard template={template} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={300}>
            <div className="text-center mt-12">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#c9a96e] hover:text-[#d4b87a] transition-colors border-b border-[#c9a96e]/30 hover:border-[#c9a96e] pb-0.5"
              >
                View All Templates
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                  <path d="M1 4h14M10 1l4 3-4 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#0a0a0a] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              overline="By Style"
              title="Find Your Perfect Invitation"
              subtitle="Four distinct collections, each crafted with its own soul"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 lg:mt-16">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.name} delay={i * 80}>
                <Link
                  href={cat.href}
                  className="group block p-6 border border-white/[0.07] bg-[#0f0f0f] hover:border-white/[0.12] transition-all duration-400 space-y-3"
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: cat.accent }}
                    >
                      {cat.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-[#faf8f5] group-hover:text-[#c9a96e] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#6a6a6a] mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why FOR Vows */}
      <section className="bg-[#141414] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <ScrollReveal>
              <SectionHeading
                overline="Why FOR Vows"
                title="Where Design Meets Devotion"
                subtitle="We believe a wedding invitation is more than paper — it's the first chapter of your celebration. We craft it accordingly."
                align="left"
              />
              <div className="mt-8 space-y-6">
                {valueProps.map((vp) => (
                  <div key={vp.number} className="flex gap-4">
                    <span className="text-xs text-[#c9a96e]/60 font-mono mt-1">
                      {vp.number}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-[#faf8f5]">
                        {vp.title}
                      </h4>
                      <p className="text-sm text-[#6a6a6a] mt-1 leading-relaxed">
                        {vp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="text-[11px] tracking-[0.15em] uppercase text-[#c9a96e] hover:text-[#d4b87a] border-b border-[#c9a96e]/30 hover:border-[#c9a96e] pb-0.5 transition-colors"
                >
                  Learn Our Story
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1206] via-[#2d1f0a] to-[#1a1206]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <p className="font-serif italic text-5xl text-[#c9a96e]/80">FOR</p>
                    <p className="font-serif italic text-4xl text-[#c9a96e]/50">Vows</p>
                    <div className="w-24 h-px bg-[#c9a96e]/30 mx-auto mt-2" />
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/40">
                      Crafting Your Sacred Moments
                    </p>
                  </div>
                </div>
                <div className="absolute inset-4 border border-[#c9a96e]/10 pointer-events-none" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="bg-[#0f0f0f] py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              overline="The Process"
              title="How It Works"
              subtitle="From vision to published invitation in five thoughtful steps"
            />
          </ScrollReveal>

          <div className="mt-14">
            {howItWorksSteps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 80}>
                <HowItWorksStep step={step} last={i === howItWorksSteps.length - 1} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <div className="text-center mt-12">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#c9a96e] hover:text-[#d4b87a] border-b border-[#c9a96e]/30 hover:border-[#c9a96e] pb-0.5 transition-colors"
              >
                Learn More
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                  <path d="M1 4h14M10 1l4 3-4 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0a0a0a] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              overline="Couples Stories"
              title="Words From Our Couples"
              subtitle="The greatest compliment is when our work becomes part of your memory"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 lg:mt-16">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <TestimonialCard testimonial={t} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        overline="Begin Your Journey"
        title="Your Invitation Deserves to Be Remembered"
        subtitle="Let us craft a digital invitation that reflects the depth of your celebration and the beauty of your love."
        primaryCta={{ label: "Start Your Invitation", href: "/contact" }}
        secondaryCta={{ label: "Explore Templates", href: "/templates" }}
      />
    </>
  );
}
