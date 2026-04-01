"use client";

import { Suspense, useState } from "react";
import { Loader2, Headphones, MessageCircle, ChevronDown, Mail } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { WA_NUMBER } from "@/lib/config";

interface FaqItem {
  question: { id: string; en: string };
  answer: { id: string; en: string };
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: { id: "Bagaimana cara memesan undangan?", en: "How do I order an invitation?" },
    answer: {
      id: "Pilih template yang Anda suka dari halaman template, pilih paket yang sesuai, lalu isi formulir pemesanan. Pembayaran dapat dilakukan melalui Midtrans (kartu kredit, bank transfer, dll).",
      en: "Choose your favorite template from the template page, select the appropriate package, then fill out the order form. Payment can be made through Midtrans (credit card, bank transfer, etc.).",
    },
  },
  {
    question: { id: "Berapa lama proses pembuatan?", en: "How long does the creation process take?" },
    answer: {
      id: "Untuk paket Basic, proses membutuhkan 3-5 hari kerja. Untuk paket Premium dan Exclusive, tim kami akan memberikan estimasi waktu yang lebih detail setelah konfirmasi pesanan.",
      en: "For the Basic package, the process takes 3-5 working days. For Premium and Exclusive packages, our team will provide a more detailed time estimate after order confirmation.",
    },
  },
  {
    question: { id: "Apakah bisa revisi desain?", en: "Can I request design revisions?" },
    answer: {
      id: "Ya! Anda dapat meminta revisi melalui WhatsApp. Jumlah revisi tergantung pada paket yang Anda pilih. Paket Premium dan Exclusive termasuk revisi tanpa batas.",
      en: "Yes! You can request revisions via WhatsApp. The number of revisions depends on the package you choose. Premium and Exclusive packages include unlimited revisions.",
    },
  },
  {
    question: { id: "Bagaimana cara mengundang tamu?", en: "How do I invite guests?" },
    answer: {
      id: "Setelah desain selesai, Anda akan mendapatkan link undangan digital yang bisa langsung dibagikan ke tamu melalui WhatsApp, email, atau media sosial.",
      en: "Once the design is complete, you will receive a digital invitation link that you can share directly with guests via WhatsApp, email, or social media.",
    },
  },
  {
    question: { id: "Apakah ada jaminan uang kembali?", en: "Is there a money-back guarantee?" },
    answer: {
      id: "Kami memberikan garansi kepuasan. Jika hasil tidak sesuai ekspektasi, tim kami akan bekerja sama untuk menemukan solusi terbaik sebelum memproses pengembalian dana.",
      en: "We provide a satisfaction guarantee. If the result doesn't meet your expectations, our team will work together to find the best solution before processing any refunds.",
    },
  },
];

function FaqItem({ item, lang, isOpen, onToggle }: { item: FaqItem; lang: "id" | "en"; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-outline-variant/10 last:border-0">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-surface-container-low transition-colors"
      >
        <span className="text-sm font-semibold text-on-surface pr-4">
          {lang === "id" ? item.question.id : item.question.en}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`text-stitch-primary shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-sm text-stone-500 leading-relaxed">
            {lang === "id" ? item.answer.id : item.answer.en}
          </p>
        </div>
      )}
    </div>
  );
}

function SupportContent() {
  const { lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const waMessage = lang === "id"
    ? "Halo FOR Vows! Saya memiliki pertanyaan tentang layanan undangan digital."
    : "Hello FOR Vows! I have a question about your digital invitation service.";

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="customer" />

      <main className="ml-64 min-h-screen bg-white">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-12 py-8 border-b border-outline-variant/10">
          <h2 className="font-headline text-3xl italic text-on-surface tracking-tight">
            {lang === "id" ? "Bantuan & Dukungan" : "Help & Support"}
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            {lang === "id"
              ? "Temukan jawaban atau hubungi tim kami langsung."
              : "Find answers or contact our team directly."}
          </p>
        </header>

        <section className="px-12 pb-24">
          <div className="max-w-2xl mt-8 space-y-8">
            {/* FAQ Section */}
            <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)]">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10">
                <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-secondary">
                  {lang === "id" ? "Pertanyaan Umum" : "Frequently Asked Questions"}
                </h3>
              </div>
              <div>
                {FAQ_ITEMS.map((item, i) => (
                  <FaqItem
                    key={i}
                    item={item}
                    lang={lang}
                    isOpen={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp Support */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 p-6 flex flex-col gap-4 hover:border-stitch-primary/30 hover:shadow-[0_20px_40px_rgba(43,43,43,0.06)] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <MessageCircle size={20} strokeWidth={1.5} className="text-[#25D366]" />
                </div>
                <div>
                  <h4 className="font-label text-[11px] uppercase tracking-widest text-stitch-primary font-semibold mb-1">
                    WhatsApp
                  </h4>
                  <p className="font-headline text-lg text-on-surface">
                    {lang === "id" ? "Chat Langsung" : "Live Chat"}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {lang === "id"
                      ? "Respons dalam 1-2 jam"
                      : "Response within 1-2 hours"}
                  </p>
                </div>
                <div className="mt-auto pt-2 border-t border-outline-variant/10">
                  <span className="text-xs text-stitch-primary group-hover:underline">
                    {lang === "id" ? "Mulai percakapan →" : "Start conversation →"}
                  </span>
                </div>
              </a>

              {/* Email Support */}
              <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 p-6 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-stitch-primary/10 flex items-center justify-center">
                  <Mail size={20} strokeWidth={1.5} className="text-stitch-primary" />
                </div>
                <div>
                  <h4 className="font-label text-[11px] uppercase tracking-widest text-stitch-primary font-semibold mb-1">
                    Email
                  </h4>
                  <p className="font-headline text-lg text-on-surface">
                    {lang === "id" ? "Kirim Email" : "Send Email"}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {lang === "id"
                      ? "concierge@forvows.com"
                      : "concierge@forvows.com"}
                  </p>
                </div>
                <div className="mt-auto pt-2 border-t border-outline-variant/10">
                  <a
                    href="mailto:concierge@forvows.com"
                    className="text-xs text-stitch-primary hover:underline"
                  >
                    {lang === "id" ? "Kirim email →" : "Send email →"}
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-surface-container-low rounded-[1rem] p-6 border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-3">
                <Headphones size={16} strokeWidth={1.5} className="text-stitch-primary" />
                <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-primary font-semibold">
                  {lang === "id" ? "Jam Operasional" : "Operating Hours"}
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">
                    {lang === "id" ? "Senin - Jumat" : "Monday - Friday"}
                  </span>
                  <span className="text-on-surface font-medium">09:00 - 18:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">
                    {lang === "id" ? "Sabtu" : "Saturday"}
                  </span>
                  <span className="text-on-surface font-medium">10:00 - 16:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">
                    {lang === "id" ? "Minggu & Hari Libur" : "Sunday & Holidays"}
                  </span>
                  <span className="text-stone-400 italic">
                    {lang === "id" ? "Tutup" : "Closed"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <Loader2 size={24} className="text-stitch-primary animate-spin" />
        </div>
      }
    >
      <SupportContent />
    </Suspense>
  );
}