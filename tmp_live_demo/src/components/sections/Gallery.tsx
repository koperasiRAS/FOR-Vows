import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Maximize2 } from "lucide-react";

const images = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070", height: "h-[300px]" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069", height: "h-[450px]" },
  { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974", height: "h-[350px]" },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070", height: "h-[400px]" },
  { src: "https://images.unsplash.com/photo-1465495910483-34a1d374bb51?q=80&w=2070", height: "h-[300px]" },
  { src: "https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=2069", height: "h-[450px]" },
  { src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070", height: "h-[350px]" },
  { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070", height: "h-[400px]" },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
              Captured Moments
            </span>
            <h2 className="text-4xl font-bold md:text-5xl">
              <span className="gold-gradient">Our Gallery</span>
            </h2>
          </motion.div>
        </div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative mb-6 cursor-pointer overflow-hidden rounded-2xl border border-gold/10"
              onClick={() => setSelectedImage(image.src)}
            >
              <img
                src={image.src}
                alt={`Gallery ${index}`}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${image.height}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-premium-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-soft-black/80 text-gold shadow-lg backdrop-blur-sm">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-premium-black/95 p-4 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              className="absolute top-6 right-6 z-[160] flex h-12 w-12 items-center justify-center rounded-full bg-soft-black text-premium-white hover:text-gold"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl border border-gold/20 shadow-2xl shadow-gold/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Selected"
                className="h-full w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
