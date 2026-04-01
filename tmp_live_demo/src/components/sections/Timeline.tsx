import { motion } from "motion/react";
import { Heart } from "lucide-react";

const timelineItems = [
  {
    year: "2018",
    title: "First Encounter",
    description: "It all started at a small coffee shop in the heart of the city. A simple conversation turned into hours of laughter.",
  },
  {
    year: "2020",
    title: "The Journey Begins",
    description: "We decided to walk through life together, supporting each other's dreams and building a foundation of trust.",
  },
  {
    year: "2023",
    title: "The Proposal",
    description: "Under the starlit sky of Cappadocia, Arthur asked the most important question, and Evelyn said 'Yes'.",
  },
  {
    year: "2026",
    title: "The Big Day",
    description: "Today, we celebrate our union with all of you, starting a new chapter as husband and wife.",
  },
];

export default function Timeline() {
  return (
    <section className="relative bg-soft-black py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 block text-sm font-medium tracking-[0.3em] text-gold uppercase">
              Our Journey
            </span>
            <h2 className="text-4xl font-bold md:text-5xl">
              <span className="gold-gradient">Love Story</span>
            </h2>
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

          <div className="space-y-24">
            {timelineItems.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative flex flex-col items-center gap-8 md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} text-center`}>
                  <span className="mb-2 block font-serif text-3xl font-bold italic text-gold">
                    {item.year}
                  </span>
                  <h3 className="mb-4 text-xl font-bold text-premium-white">{item.title}</h3>
                  <p className="mx-auto max-w-xs text-sm leading-relaxed text-premium-white/60 md:mx-0">
                    {item.description}
                  </p>
                </div>

                {/* Center Icon */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-premium-black shadow-xl">
                  <Heart className="h-5 w-5 text-gold" fill="currentColor" />
                </div>

                {/* Spacer */}
                <div className="hidden flex-1 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
