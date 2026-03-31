"use client";

import { useEffect, useState } from "react";
import { Mail, Instagram, ArrowDown, Sparkles, MapPin } from "lucide-react";

export function FloralLuxuryTemplate() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0906] text-[#fbf7f0] font-serif selection:bg-[#cfa579] selection:text-white relative overflow-hidden">
      {/* Floral Background Textures */}
      <div 
        className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-10 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, #cfa579 0%, transparent 70%)"
        }}
      />
      <div 
        className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.07] pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, #a2605e 0%, transparent 70%)"
        }}
      />
      
      {/* Minimal Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-[#0d0906]/80 backdrop-blur-md border-b border-[#cfa579]/10' : 'py-8'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl tracking-widest uppercase text-[#cfa579] font-light">
            Elora <span className="italic font-serif">Studio</span>
          </div>
          <div className="hidden md:flex gap-8 text-[11px] tracking-[0.2em] font-sans uppercase text-[#a99c92]">
            <a href="#about" className="hover:text-[#cfa579] transition-colors">Biography</a>
            <a href="#projects" className="hover:text-[#cfa579] transition-colors">Selected Works</a>
            <a href="#contact" className="hover:text-[#cfa579] transition-colors">Get in Touch</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20">
        <div className="text-center z-10 max-w-4xl mx-auto">
          <p className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#cfa579] mb-8 flex items-center justify-center gap-3">
            <Sparkles size={12} />
            Fine Art & Creative Direction
            <Sparkles size={12} />
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-8">
            Sebuah harmoni antara <br />
            <span className="italic text-[#cfa579]">keindahan</span> & makna.
          </h1>
          <p className="text-[#a99c92] text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Crafting timeless visual narratives through luxury design, elegant floral arrangements, and profound storytelling for exquisite brands. 
            Setiap karya diciptakan dengan ketelitian tinggi untuk menghadirkan pengalaman visual yang tak terlupakan.
          </p>
          
          <div className="mt-16 flex justify-center">
            <a href="#projects" className="w-12 h-12 rounded-full border border-[#cfa579]/30 flex items-center justify-center text-[#cfa579] hover:bg-[#cfa579] hover:text-[#0d0906] transition-all duration-500 hover:scale-110">
              <ArrowDown size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

      {/* Philosophy / About */}
      <section id="about" className="py-24 md:py-40 px-6 relative">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[3/4] overflow-hidden group">
            <div className="absolute inset-0 bg-[#cfa579]/5 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-1000" />
            <img 
              src="https://images.unsplash.com/photo-1507676184212-d0330a15183c?q=80&w=1000&auto=format&fit=crop" 
              alt="Floral Arrangement" 
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out"
            />
            {/* Corner Decorative Frame */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-[#cfa579]/40 z-20" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-[#cfa579]/40 z-20" />
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl italic text-[#cfa579]">The Artist</h2>
            <div className="space-y-6 text-[#a99c92] font-sans text-sm md:text-base leading-relaxed font-light">
              <p>
                Berbasis di Jakarta, Elora menggabungkan esensi <span className="text-[#fbf7f0]">luxury aesthetic</span> dengan sentuhan organik botani. My design philosophy is rooted in the belief that true elegance whispers, rather than shouts.
              </p>
              <p>
                Dengan latar belakang di bidang *Fine Arts*, kami menghadirkan perspektif unik ke dalam setiap mahakarya. From high-end editorial campaigns to bespoke brand identities, we ensure every detail blooms with purpose.
              </p>
            </div>
            <div className="pt-6 border-t border-[#cfa579]/10">
              <div className="flex gap-12 font-sans">
                <div>
                  <p className="text-2xl text-[#fbf7f0] mb-1">8+</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#a99c92]">Years Exp.</p>
                </div>
                <div>
                  <p className="text-2xl text-[#fbf7f0] mb-1">150</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#a99c92]">Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="py-8 bg-[#cfa579] text-[#0d0906] overflow-hidden whitespace-nowrap border-y border-[#cfa579]/20">
        <div className="animate-marquee inline-block font-serif text-2xl md:text-4xl italic tracking-wide pr-8">
          Luxury Branding ✧ Floral Design ✧ Creative Direction ✧ Fine Art Photography ✧ Luxury Branding ✧ Floral Design ✧ Creative Direction ✧ Fine Art Photography ✧
        </div>
      </div>

      {/* Selected Works Grid */}
      <section id="projects" className="py-24 md:py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#cfa579] mb-4">Portfolio</p>
            <h2 className="text-4xl md:text-5xl italic">Selected Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Project 1 */}
            <div className="group cursor-pointer">
              <div className="block overflow-hidden relative aspect-[4/5] mb-6">
                <div className="absolute inset-0 bg-[#0d0906]/20 group-hover:bg-[#0d0906]/0 transition-colors duration-700 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1542456012-16e7dd78ec22?q=80&w=800&auto=format&fit=crop" 
                  alt="Aesthetic Editorial" 
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[1.5s]"
                />
              </div>
              <div className="flex justify-between items-start font-sans">
                <div>
                  <h3 className="text-xl font-serif text-[#fbf7f0] mb-2 group-hover:text-[#cfa579] transition-colors">Whispering Petals</h3>
                  <p className="text-xs tracking-wider text-[#a99c92] uppercase">Editorial Campaign</p>
                </div>
                <span className="text-xs text-[#cfa579]">2025</span>
              </div>
            </div>

            {/* Project 2 (Offset) */}
            <div className="group cursor-pointer md:mt-24">
              <div className="block overflow-hidden relative aspect-[4/5] mb-6">
                <div className="absolute inset-0 bg-[#0d0906]/20 group-hover:bg-[#0d0906]/0 transition-colors duration-700 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop" 
                  alt="Floral Identity" 
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[1.5s]"
                />
              </div>
              <div className="flex justify-between items-start font-sans">
                <div>
                  <h3 className="text-xl font-serif text-[#fbf7f0] mb-2 group-hover:text-[#cfa579] transition-colors">The Spring Gala</h3>
                  <p className="text-xs tracking-wider text-[#a99c92] uppercase">Art Direction</p>
                </div>
                <span className="text-xs text-[#cfa579]">2026</span>
              </div>
            </div>
            
            {/* Project 3 */}
            <div className="group cursor-pointer">
              <div className="block overflow-hidden relative aspect-[4/5] mb-6 hover:shadow-2xl">
                <div className="absolute inset-0 bg-[#cfa579]/10 blend-overlay z-10 group-hover:bg-transparent transition-all duration-700" />
                <img 
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop" 
                  alt="Luxury Packaging" 
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[1.5s]"
                />
              </div>
              <div className="flex justify-between items-start font-sans">
                <div>
                  <h3 className="text-xl font-serif text-[#fbf7f0] mb-2 group-hover:text-[#cfa579] transition-colors">L'Essence Perfume</h3>
                  <p className="text-xs tracking-wider text-[#a99c92] uppercase">Brand Identity</p>
                </div>
                <span className="text-xs text-[#cfa579]">2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="py-24 border-t border-[#cfa579]/20 relative overflow-hidden">
        {/* Subtle floral emblem in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] opacity-[0.03] pointer-events-none">
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#cfa579" d="M37.5,-63.9C50,-55.8,62.8,-48.1,72.6,-36.8C82.4,-25.5,89.2,-10.8,87.7,3.3C86.1,17.3,76.3,30.8,65.6,42.5C54.8,54.2,43.2,64,29.9,69.5C16.5,75.1,1.4,76.4,-12.3,73C-26,69.7,-38.3,61.7,-49.9,51.8C-61.6,41.9,-72.6,30.2,-77.9,16.2C-83.3,2.2,-83.1,-14.2,-76.3,-27.9C-69.5,-41.6,-56.1,-52.7,-42.6,-60.5C-29.1,-68.3,-15.5,-72.8,-1.2,-71C13.1,-69.1,25,-62,37.5,-63.9Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-5xl md:text-7xl font-light italic">
            Mari <span className="text-[#cfa579]">berkolaborasi</span>.
          </h2>
          <p className="text-sm md:text-base text-[#a99c92] font-sans font-light max-w-xl mx-auto">
            Ready to elevate your visual identity? We are currently accepting new commissions for the upcoming season. Hubungi kami untuk mendiskusikan visi Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 font-sans">
            <a href="mailto:hello@elorastudio.com" className="group flex items-center justify-center gap-3 px-8 py-4 border border-[#cfa579]/30 hover:bg-[#cfa579] hover:text-[#0d0906] transition-all duration-300">
              <Mail size={16} className="text-[#cfa579] group-hover:text-[#0d0906]" />
              <span className="text-[11px] tracking-widest uppercase">hello@elorastudio</span>
            </a>
            <a href="https://instagram.com" className="group flex items-center justify-center gap-3 px-8 py-4 border border-[#cfa579]/30 hover:bg-[#cfa579] hover:text-[#0d0906] transition-all duration-300">
              <Instagram size={16} className="text-[#cfa579] group-hover:text-[#0d0906]" />
              <span className="text-[11px] tracking-widest uppercase">@elora.studio</span>
            </a>
          </div>

          <div className="pt-20 flex flex-col items-center gap-4 text-[#a99c92] text-xs font-sans tracking-wide">
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-[#cfa579]" />
              <span>Jakarta, ID — Available Worldwide</span>
            </div>
            <p>© {new Date().getFullYear()} Elora Studio. Built on FOR Vows Platform.</p>
          </div>
        </div>
      </footer>

      {/* Required style block for the marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          width: fit-content;
        }
      `}} />
    </div>
  );
}
