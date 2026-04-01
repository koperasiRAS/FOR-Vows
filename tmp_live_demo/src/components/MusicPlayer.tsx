import { useState, useEffect, useRef } from "react";
import { Music, Music2, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface MusicPlayerProps {
  autoPlay?: boolean;
}

export default function MusicPlayer({ autoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlay) {
      const playAudio = () => {
        audioRef.current?.play().catch(() => {
          // Autoplay might be blocked by browser
          console.log("Autoplay blocked");
        });
        setIsPlaying(true);
        window.removeEventListener("click", playAudio);
      };

      window.addEventListener("click", playAudio);
      return () => window.removeEventListener("click", playAudio);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder wedding-like track
        loop
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-soft-black/80 backdrop-blur-md transition-all shadow-lg",
          isPlaying ? "border-gold text-gold shadow-gold/20" : "text-premium-white/60"
        )}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <Volume2 className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <VolumeX className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing effect when playing */}
        {isPlaying && (
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
        )}
      </motion.button>
    </div>
  );
}
