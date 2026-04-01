import { motion } from "motion/react";
import { Calendar, Clock, MapPin, ExternalLink, Youtube } from "lucide-react";

const events = [
  {
    title: "Akad Nikah",
    date: "Sunday, 24 August 2026",
    time: "09:00 - 10:30 WIB",
    location: "The Ritz-Carlton, Jakarta",
    address: "Jl. DR. Ide Anak Agung Gde Agung Kav.E.1.1 No.1, Mega Kuningan, Jakarta",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.267209355152!2d106.82484437586733!3d-6.228459993759714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e49e000001%3A0x6d8f8d6e6e6e6e6e!2sThe%20Ritz-Carlton%20Jakarta%2C%20Mega%20Kuningan!5e0!3m2!1sen!2sid!4v1711812345678!5m2!1sen!2sid",
    googleMapsLink: "https://maps.app.goo.gl/9yXyXyXyXyXyXyXyX",
  },
  {
    title: "Resepsi Pernikahan",
    date: "Sunday, 24 August 2026",
    time: "19:00 - 21:00 WIB",
    location: "Grand Ballroom, The Ritz-Carlton",
    address: "Jl. DR. Ide Anak Agung Gde Agung Kav.E.1.1 No.1, Mega Kuningan, Jakarta",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.267209355152!2d106.82484437586733!3d-6.228459993759714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e49e000001%3A0x6d8f8d6e6e6e6e6e!2sThe%20Ritz-Carlton%20Jakarta%2C%20Mega%20Kuningan!5e0!3m2!1sen!2sid!4v1711812345678!5m2!1sen!2sid",
    googleMapsLink: "https://maps.app.goo.gl/9yXyXyXyXyXyXyXyX",
  },
];

export default function Events() {
  return (
    <section className="relative bg-premium-black py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 block text-sm font-medium tracking-[0.3em] text-gold uppercase">
              Save the Date
            </span>
            <h2 className="text-4xl font-bold md:text-5xl">
              <span className="gold-gradient">Wedding Events</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-3xl border border-gold/10 bg-soft-black p-8 transition-all hover:border-gold/30"
            >
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold/5 blur-3xl transition-all group-hover:bg-gold/10" />
              
              <h3 className="mb-8 text-3xl font-bold text-gold">{event.title}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest text-premium-white/40 uppercase">Date</p>
                    <p className="font-serif text-lg italic text-premium-white">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest text-premium-white/40 uppercase">Time</p>
                    <p className="font-serif text-lg italic text-premium-white">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest text-premium-white/40 uppercase">Location</p>
                    <p className="font-serif text-lg italic text-premium-white">{event.location}</p>
                    <p className="mt-1 text-sm text-premium-white/60">{event.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <div className="h-[200px] w-full overflow-hidden rounded-2xl border border-gold/10">
                  <iframe
                    src={event.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale invert transition-all duration-700 hover:grayscale-0 hover:invert-0"
                  />
                </div>
                <a
                  href={event.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/20 bg-premium-black py-4 text-xs font-bold tracking-widest text-gold transition-all hover:bg-gold hover:text-premium-black"
                >
                  <ExternalLink className="h-4 w-4" />
                  OPEN IN GOOGLE MAPS
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Streaming Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 overflow-hidden rounded-3xl border border-gold/10 bg-soft-black p-8 text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <Youtube className="h-8 w-8" />
            </div>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-premium-white">Live Streaming</h3>
          <p className="mx-auto mb-8 max-w-xl text-premium-white/60">
            For those who cannot attend in person, we invite you to witness our union virtually through our live stream.
          </p>
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-gold/10">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder
              title="Wedding Live Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="grayscale-[0.5] transition-all hover:grayscale-0"
            />
          </div>
          <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-4 text-xs font-bold tracking-widest text-premium-black transition-all hover:bg-gold/80 md:mx-auto md:w-auto md:px-12">
            WATCH LIVE
          </button>
        </motion.div>
      </div>
    </section>
  );
}
