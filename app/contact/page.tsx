import * as LucideIcons from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ContactForm } from "@/components/contact/ContactForm";

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
                  href="https://wa.me/6287779560264"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-[#20bd5a] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
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
                    <LucideIcons.Mail size={16} className="text-[#c9a96e] mt-0.5 shrink-0" />
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
                    <LucideIcons.Phone size={16} className="text-[#c9a96e] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6a6a6a]">WhatsApp</p>
                      <a
                        href="https://wa.me/6287779560264"
                        className="text-sm text-[#faf8f5] hover:text-[#c9a96e] transition-colors"
                      >
                        +62 877 7956 0264
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <LucideIcons.Instagram size={16} className="text-[#c9a96e] mt-0.5 shrink-0" />
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
                    <LucideIcons.MapPin size={16} className="text-[#c9a96e] mt-0.5 shrink-0" />
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
