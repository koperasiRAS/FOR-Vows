import { motion } from "motion/react";
import { Instagram, ExternalLink } from "lucide-react";

interface ProfileProps {
  name: string;
  role: string;
  image: string;
  parents: string;
  instagram: string;
  isReversed?: boolean;
}

function Profile({ name, role, image, parents, instagram, isReversed }: ProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`flex flex-col items-center gap-8 md:flex-row ${isReversed ? "md:flex-row-reverse" : ""}`}
    >
      {/* Image Frame */}
      <div className="relative group">
        <div className="absolute -inset-4 border border-gold/20 transition-all duration-500 group-hover:-inset-2 group-hover:border-gold/40" />
        <div className="relative h-80 w-64 overflow-hidden bg-soft-black md:h-[450px] md:w-72">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-premium-black/60 to-transparent" />
        </div>
      </div>

      {/* Info */}
      <div className={`flex flex-col ${isReversed ? "md:items-end md:text-right" : "md:items-start md:text-left"} items-center text-center`}>
        <span className="mb-2 text-sm font-medium tracking-[0.3em] text-gold uppercase">
          The {role}
        </span>
        <h3 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
          <span className="gold-gradient">{name}</span>
        </h3>
        <p className="mb-6 max-w-xs text-sm leading-relaxed text-premium-white/60">
          Son of <br />
          <span className="font-serif text-lg italic text-premium-white/90">{parents}</span>
        </p>
        <a
          href={`https://instagram.com/${instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-full border border-gold/20 bg-soft-black px-6 py-3 text-xs font-semibold tracking-widest text-premium-white/80 transition-all hover:border-gold hover:text-gold"
        >
          <Instagram className="h-4 w-4" />
          <span>@{instagram}</span>
          <ExternalLink className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
        </a>
      </div>
    </motion.div>
  );
}

export default function Couple() {
  return (
    <section className="relative overflow-hidden bg-premium-black py-24 md:py-32">
      {/* Background Decorative Text */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
        <span className="font-serif text-[20vw] font-bold italic text-premium-white">Union</span>
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              <span className="gold-gradient">Meet the Couple</span>
            </h2>
            <p className="mx-auto max-w-2xl font-serif text-lg italic text-premium-white/60">
              "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-24 md:gap-32">
          <Profile
            name="Arthur"
            role="Groom"
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
            parents="Mr. George Alexander & Mrs. Mary Alexander"
            instagram="arthur_alex"
          />
          
          <div className="flex h-px w-12 bg-gold/30 md:hidden" />

          <Profile
            name="Evelyn"
            role="Bride"
            image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
            parents="Mr. Thomas Wright & Mrs. Sarah Wright"
            instagram="eve_wright"
            isReversed
          />
        </div>
      </div>
    </section>
  );
}
