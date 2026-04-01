import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle2, User, Users, MessageSquare, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { Wish } from "@/src/types";

export default function RSVP() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: "1",
      name: "Michael Chen",
      message: "Congratulations Arthur and Evelyn! Wishing you both a lifetime of happiness and love.",
      attendance: "yes",
      date: "2 hours ago",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      message: "So happy for you guys! Can't wait to celebrate your big day together.",
      attendance: "yes",
      date: "5 hours ago",
    },
    {
      id: "3",
      name: "David Miller",
      message: "Best wishes for your new journey together. May your love grow stronger every day.",
      attendance: "maybe",
      date: "1 day ago",
    },
  ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newWish: Wish = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      message: formData.get("message") as string,
      attendance: formData.get("attendance") as any,
      date: "Just now",
    };

    setWishes([newWish, ...wishes]);
    setIsSubmitted(true);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C6A769", "#F5F5F5", "#1A1A1A"],
    });

    setTimeout(() => setIsSubmitted(false), 5000);
    e.currentTarget.reset();
  };

  return (
    <section className="relative bg-premium-black py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* RSVP Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-gold/10 bg-soft-black p-8 md:p-12"
          >
            <div className="mb-10">
              <h2 className="mb-4 text-4xl font-bold text-gold">RSVP</h2>
              <p className="text-premium-white/60">
                Please let us know if you can attend our wedding celebration.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-premium-white/40 uppercase">
                  <User className="h-3 w-3 text-gold" />
                  Full Name
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-gold/10 bg-premium-black px-6 py-4 text-premium-white outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-premium-white/40 uppercase">
                  <Users className="h-3 w-3 text-gold" />
                  Attendance
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["yes", "no", "maybe"].map((option) => (
                    <label key={option} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value={option}
                        defaultChecked={option === "yes"}
                        className="peer sr-only"
                      />
                      <div className="flex flex-col items-center justify-center rounded-xl border border-gold/10 bg-premium-black py-4 text-xs font-bold tracking-widest text-premium-white/40 transition-all peer-checked:border-gold peer-checked:bg-gold/10 peer-checked:text-gold uppercase">
                        {option}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-premium-white/40 uppercase">
                  <MessageSquare className="h-3 w-3 text-gold" />
                  Your Message
                </label>
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Leave a message for the couple"
                  className="w-full resize-none rounded-xl border border-gold/10 bg-premium-black px-6 py-4 text-premium-white outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gold py-5 text-sm font-bold tracking-widest text-premium-black transition-all hover:bg-gold/90 disabled:opacity-50"
              >
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      SUBMITTED
                    </motion.div>
                  ) : (
                    <motion.div
                      key="submit"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      SEND RSVP
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </form>
          </motion.div>

          {/* Guest Wishes */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="mb-10">
              <h2 className="mb-4 text-4xl font-bold text-gold">Guest Wishes</h2>
              <p className="text-premium-white/60">
                Warm messages from our family and friends.
              </p>
            </div>

            <div className="max-h-[600px] space-y-6 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gold/20">
              <AnimatePresence initial={false}>
                {wishes.map((wish) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-gold/5 bg-soft-black/50 p-6 backdrop-blur-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-premium-white">{wish.name}</h4>
                          <span className="text-[10px] text-premium-white/40 uppercase">{wish.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-[10px] font-bold text-gold uppercase">
                        <Heart className="h-3 w-3" fill="currentColor" />
                        {wish.attendance}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-premium-white/70 italic">
                      "{wish.message}"
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
