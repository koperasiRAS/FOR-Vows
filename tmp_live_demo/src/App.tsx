import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Cover from "./components/sections/Cover";
import Hero from "./components/sections/Hero";
import Couple from "./components/sections/Couple";
import Timeline from "./components/sections/Timeline";
import Events from "./components/sections/Events";
import Gallery from "./components/sections/Gallery";
import RSVP from "./components/sections/RSVP";
import Gifts from "./components/sections/Gifts";
import Footer from "./components/Footer";
import MusicPlayer from "./components/MusicPlayer";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) {
      setGuestName(decodeURIComponent(to));
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    // Scroll to top when opening
    window.scrollTo(0, 0);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-premium-black">
      {/* Cover Overlay */}
      <Cover onOpen={handleOpen} isOpen={isOpen} guestName={guestName} />

      {/* Main Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="flex flex-col"
          >
            <MusicPlayer autoPlay={true} />
            
            <Hero />
            
            <div className="relative z-10">
              <Couple />
              <Timeline />
              <Events />
              <Gallery />
              <RSVP />
              <Gifts />
              <Footer />
            </div>

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
              <div className="absolute -right-20 top-3/4 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
