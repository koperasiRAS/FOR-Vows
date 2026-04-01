import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, Copy, Check, Gift, QrCode } from "lucide-react";

const bankAccounts = [
  {
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "1234567890",
    accountHolder: "Arthur Alexander",
  },
  {
    bankName: "Bank Mandiri",
    accountNumber: "0987654321",
    accountHolder: "Evelyn Wright",
  },
];

export default function Gifts() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showGifts, setShowGifts] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="relative bg-soft-black py-24 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="mb-4 block text-sm font-medium tracking-[0.3em] text-gold uppercase">
            Wedding Gift
          </span>
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            <span className="gold-gradient">Digital Gift</span>
          </h2>
          <p className="mx-auto max-w-xl text-premium-white/60">
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, a digital contribution would be greatly appreciated.
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowGifts(!showGifts)}
          className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-gold/30 bg-premium-black px-10 py-5 transition-all hover:border-gold hover:bg-gold/10"
        >
          <Gift className="h-5 w-5 text-gold" />
          <span className="text-sm font-bold tracking-[0.2em] text-premium-white uppercase">
            {showGifts ? "Hide Digital Gift" : "Send Digital Gift"}
          </span>
        </motion.button>

        <AnimatePresence>
          {showGifts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-16 grid gap-8 md:grid-cols-2"
            >
              {bankAccounts.map((account, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-gold/10 bg-premium-black p-8 text-left transition-all hover:border-gold/30"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-premium-white/30 uppercase">
                      Bank Transfer
                    </span>
                  </div>

                  <h4 className="mb-2 text-lg font-bold text-premium-white">{account.bankName}</h4>
                  <div className="mb-6">
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-soft-black/50 p-4">
                      <span className="font-mono text-xl font-bold tracking-wider text-gold">
                        {account.accountNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(account.accountNumber, index)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold transition-all hover:bg-gold hover:text-premium-black"
                      >
                        {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs font-medium tracking-widest text-premium-white/40 uppercase">
                      a.n {account.accountHolder}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold/60 uppercase">
                    <QrCode className="h-4 w-4" />
                    <span>Scan QRIS Available</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
