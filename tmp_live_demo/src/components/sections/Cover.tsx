import { motion, AnimatePresence } from "motion/react";
import { MailOpen, Music, Music2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface CoverProps {
  onOpen: () => void;
  isOpen: boolean;
  guestName: string;
}

export default function Cover({ onOpen, isOpen, guestName }: CoverProps) {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-premium-black"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"
              alt="Wedding Background"
              className="h-full w-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-premium-black/60 via-transparent to-premium-black" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <span className="mb-4 block text-sm font-medium tracking-[0.3em] text-gold uppercase">
                The Wedding of
              </span>
              <h1 className="mb-2 text-5xl font-bold md:text-7xl lg:text-8xl">
                <span className="gold-gradient">Arthur</span>
                <span className="mx-4 font-serif text-3xl font-light italic text-premium-white/60 md:text-5xl">&</span>
                <span className="gold-gradient">Evelyn</span>
              </h1>
              <p className="mt-8 font-serif text-xl italic tracking-widest text-premium-white/80 md:text-2xl">
                Sunday, 24 August 2026
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-16 flex flex-col items-center"
            >
              <p className="mb-2 text-xs font-medium tracking-widest text-premium-white/40 uppercase">
                Special Invitation for
              </p>
              <h2 className="mb-8 text-2xl font-serif font-medium text-premium-white">
                {guestName || "Our Beloved Guest"}
              </h2>

              <button
                onClick={onOpen}
                className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-gold/30 bg-soft-black px-8 py-4 transition-all hover:border-gold hover:bg-gold/10"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <MailOpen className="h-5 w-5 text-gold transition-transform group-hover:scale-110" />
                <span className="text-sm font-semibold tracking-[0.2em] text-premium-white uppercase">
                  Open Invitation
                </span>
              </button>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-10 left-10 hidden lg:block">
            <div className="h-24 w-px bg-gradient-to-t from-gold/50 to-transparent" />
          </div>
          <div className="absolute top-10 right-10 hidden lg:block">
            <div className="h-24 w-px bg-gradient-to-b from-gold/50 to-transparent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
