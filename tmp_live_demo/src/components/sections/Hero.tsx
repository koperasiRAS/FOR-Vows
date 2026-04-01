import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Calendar, MapPin, ChevronDown } from "lucide-react";

interface CountdownProps {
  targetDate: string;
}

function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 md:gap-8">
      {units.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gold/20 bg-soft-black/50 backdrop-blur-sm md:h-24 md:w-24">
            <span className="text-2xl font-bold text-gold md:text-4xl">{unit.value}</span>
          </div>
          <span className="mt-2 text-[10px] font-medium tracking-widest text-premium-white/40 uppercase md:text-xs">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
          alt="Wedding Hero"
          className="h-full w-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-premium-black via-transparent to-premium-black" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="mb-12"
        >
          <span className="mb-6 block text-sm font-medium tracking-[0.4em] text-gold uppercase">
            The Wedding Celebration of
          </span>
          <h2 className="mb-4 text-6xl font-bold md:text-8xl lg:text-9xl">
            <span className="gold-gradient">Arthur</span>
            <span className="mx-4 font-serif text-3xl font-light italic text-premium-white/40 md:text-5xl">&</span>
            <span className="gold-gradient">Evelyn</span>
          </h2>
          <div className="mx-auto mt-8 h-px w-24 bg-gold/50" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-16 flex flex-col items-center gap-4 md:flex-row md:gap-12"
        >
          <div className="flex items-center gap-3 text-premium-white/80">
            <Calendar className="h-5 w-5 text-gold" />
            <span className="font-serif text-lg tracking-widest italic">24 August 2026</span>
          </div>
          <div className="flex items-center gap-3 text-premium-white/80">
            <MapPin className="h-5 w-5 text-gold" />
            <span className="font-serif text-lg tracking-widest italic">The Ritz-Carlton, Jakarta</span>
          </div>
        </motion.div>

        <Countdown targetDate="2026-08-24T09:00:00" />

        <motion.div
          style={{ opacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-medium tracking-[0.3em] text-premium-white/30 uppercase">
            Scroll to Explore
          </span>
          <ChevronDown className="h-4 w-4 text-gold/50" />
        </motion.div>
      </div>
    </section>
  );
}
