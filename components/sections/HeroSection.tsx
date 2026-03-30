import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(201,169,110,0.04) 0%, transparent 50%)",
        }}
      />

      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#c9a96e]/20 to-transparent" />
        <div className="absolute top-0 left-1/4 w-px h-16 bg-gradient-to-b from-transparent to-white/[0.03]" />
        <div className="absolute top-0 right-1/4 w-px h-16 bg-gradient-to-b from-transparent to-white/[0.03]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 pt-20">
        {/* Overline */}
        <div className="space-y-2">
          <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] font-medium">
            A Premium Wedding Invitation Studio
          </p>
          <div className="w-16 h-px bg-[#c9a96e]/40 mx-auto" />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight">
          <span className="block text-[#faf8f5]">Crafting Your</span>
          <span className="block mt-2">
            <span className="text-[#c9a96e] italic">Sacred</span>
            <span className="block text-[#faf8f5]"> Moments</span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="font-accent italic text-xl md:text-2xl text-[#8a8a8a] max-w-2xl mx-auto leading-relaxed">
          Premium digital wedding invitations that transform your celebration
          into a timeless, elegant experience. From FOR Vows.
        </p>

        {/* CTAs */}
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

        {/* Trust indicator */}
        <p className="text-xs text-[#4a4a4a] tracking-wider pt-4">
          A sub-brand of{" "}
          <span className="text-[#6a6a6a]">Frame Of Rangga</span>
        </p>
      </div>

    </section>
  );
}
