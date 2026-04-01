import { motion } from "motion/react";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-premium-black py-20 text-center">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-soft-black">
            <Heart className="h-8 w-8 text-gold" fill="currentColor" />
          </div>
          
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="gold-gradient">Arthur & Evelyn</span>
          </h2>
          
          <p className="mb-12 max-w-md text-sm leading-relaxed text-premium-white/40">
            Thank you for being a part of our journey. We look forward to celebrating our special day with you.
          </p>

          <div className="h-px w-24 bg-gold/20" />
          
          <div className="mt-12 flex flex-col items-center gap-4">
            <span className="text-[10px] font-bold tracking-[0.4em] text-premium-white/20 uppercase">
              Created with Love by
            </span>
            <span className="font-serif text-xl italic text-gold">Ethereal Union</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
