import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WA_NUMBER } from "@/lib/config";

export const metadata: Metadata = {
  title: "Hubungi Kami | FOR Vows — Undangan Digital, Foto & Video, Content Creator",
  description:
    "Hubungi FOR Vows untuk konsultasi undangan digital, foto & video, content creator, atau souvenir pernikahan. WhatsApp, email, atau formulir — tim kami siap membantu.",
  openGraph: {
    title: "Hubungi Kami | FOR Vows",
    description: "Konsultasi gratis undangan digital, foto & video, content creator, dan souvenir pernikahan premium via WhatsApp.",
    url: "https://for-vows.vercel.app/contact",
    siteName: "FOR Vows",
    locale: "id_ID",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 pb-16 text-center">
        <ScrollReveal>
          <SectionHeading
            overline="Hubungi Kami"
            title="Mari Buat Undangan Anda"
            subtitle="Ceritakan tentang pernikahan Anda dan kami akan membantu menemukan undangan sempurna, atau menciptakan sesuatu yang sepenuhnya baru."
          />
        </ScrollReveal>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
          {/* Form */}
          <ScrollReveal>
            <div className="border border-white/[0.06] bg-[#0f0f0f] p-8 lg:p-10">
              <h2 className="font-serif text-xl text-[#faf8f5] mb-6">
                Kirim Pertanyaan
              </h2>
              <ContactForm />
            </div>
          </ScrollReveal>

          {/* Contact Info */}
          <ScrollReveal delay={150}>
            <div className="space-y-8">
              {/* WhatsApp CTA */}
              <div className="p-8 border border-[#c9a96e]/20 bg-[#0f0f0f] space-y-4">
                <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e]">
                  Cara Tercepat Menghubungi Kami
                </p>
                <h3 className="font-serif text-lg text-[#faf8f5]">
                  Chat via WhatsApp
                </h3>
                <p className="text-sm text-[#6a6a6a] leading-relaxed">
                  Untuk bantuan langsung, pertanyaan, atau diskusi tentang
                  visi Anda, hubungi kami langsung via WhatsApp.
                </p>
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-[#20bd5a] transition-colors"
                >
                  <WhatsAppIcon size={16} />
                  Chat Sekarang
                </a>
              </div>

              {/* Contact details */}
              <div className="p-8 border border-white/[0.06] bg-[#0f0f0f] space-y-5">
                <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e]">
                  Cara Lain untuk Terhubung
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-[#c9a96e] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6a6a6a]">Email</p>
                      <a
                        href="mailto:frameofrangga@gmail.com"
                        className="text-sm text-[#faf8f5] hover:text-[#c9a96e] transition-colors"
                      >
                        frameofrangga@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-[#c9a96e] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6a6a6a]">WhatsApp</p>
                      <a
                        href={`https://wa.me/${WA_NUMBER}`}
                        className="text-sm text-[#faf8f5] hover:text-[#c9a96e] transition-colors"
                      >
                        +62 877 7956 0264
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <InstagramIcon size={16} className="text-[#c9a96e] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6a6a6a]">Instagram</p>
                      <a
                        href="https://instagram.com/frameofrangga"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#faf8f5] hover:text-[#c9a96e] transition-colors"
                      >
                        @frameofrangga
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#c9a96e] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6a6a6a]">Lokasi</p>
                      <p className="text-sm text-[#faf8f5]">
                        Jakarta, Indonesia
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response time */}
              <div className="p-6 border border-white/[0.05] bg-[#0a0a0a]">
                <p className="text-xs text-[#6a6a6a]">
                  <span className="text-[#c9a96e]">Waktu respons:</span>{" "}
                  Dalam 24 jam pada hari kerja. Untuk pertanyaan mendesak, silakan
                  gunakan WhatsApp.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
