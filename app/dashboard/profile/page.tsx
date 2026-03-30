"use client";

import { Suspense, useState } from "react";
import { Loader2, User, Mail, Phone, QrCode, Copy, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { WA_NUMBER } from "@/lib/config";

function ProfileContent() {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const referralCode = "FORVOWS25";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const t = (idText: string, enText: string) => (lang === "id" ? idText : enText);

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="customer" />

      <main className="ml-64 min-h-screen bg-white">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-12 py-8 border-b border-outline-variant/10">
          <h2 className="font-headline text-3xl italic text-on-surface tracking-tight">
            {t("Profil Saya", "My Profile")}
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            {t("Kelola informasi dan referral code Anda.", "Manage your profile information and referral code.")}
          </p>
        </header>

        <section className="px-12 pb-24">
          <div className="max-w-2xl mt-8 space-y-8">
            {/* Profile Info Card */}
            <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)]">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10">
                <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-secondary">
                  {t("Informasi Pribadi", "Personal Information")}
                </h3>
              </div>
              <div className="divide-y divide-outline-variant/10">
                <div className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-stitch-secondary-fixed flex items-center justify-center shrink-0">
                    <User size={16} strokeWidth={1.5} className="text-stitch-on-secondary-container" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">
                      {t("Nama", "Name")}
                    </p>
                    <p className="text-sm font-semibold text-on-surface">
                      {t("Pengguna FOR Vows", "FOR Vows User")}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-stitch-secondary-fixed flex items-center justify-center shrink-0">
                    <Mail size={16} strokeWidth={1.5} className="text-stitch-on-secondary-container" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">Email</p>
                    <p className="text-sm text-on-surface">
                      {t("Tidak tersedia", "Not available")}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-stitch-secondary-fixed flex items-center justify-center shrink-0">
                    <Phone size={16} strokeWidth={1.5} className="text-stitch-on-secondary-container" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-label mb-1">WhatsApp</p>
                    <a
                      href={`https://wa.me/${WA_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-stitch-primary hover:underline"
                    >
                      {WA_NUMBER}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Code Card */}
            <div className="bg-surface-container-lowest rounded-[1rem] border border-outline-variant/10 overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)]">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10">
                <h3 className="font-label text-[11px] uppercase tracking-widest text-stitch-secondary">
                  {t("Referral Code", "Referral Code")}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-xs text-stone-500 leading-relaxed mb-5">
                  {t(
                    "Bagikan kode referral Anda ke teman dan dapatkan diskon untuk setiap pesanan baru.",
                    "Share your referral code with friends and get discounts on every new order."
                  )}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-surface-container-low rounded-xl px-5 py-4 flex items-center gap-3 border border-outline-variant/10">
                    <QrCode size={18} strokeWidth={1.5} className="text-stitch-primary shrink-0" />
                    <code className="font-mono text-lg text-on-surface font-semibold tracking-widest">
                      {referralCode}
                    </code>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-white text-xs uppercase tracking-widest font-semibold shadow-[0_8px_24px_rgba(115,92,0,0.2)] hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)" }}
                  >
                    {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={1.5} />}
                    {copied ? t("Tersalin!", "Copied!") : t("Salin", "Copy")}
                  </button>
                </div>
                <p className="text-[10px] text-stone-400 mt-3">
                  {t("Berlaku untuk semua paket", "Valid for all packages")} · {t("Diskon 5%", "5% discount")}
                </p>
              </div>
            </div>

            {/* Edit Profile CTA */}
            <div className="bg-surface-container-low rounded-[1rem] p-6 border border-outline-variant/10 text-center">
              <p className="text-xs text-stone-500 mb-4">
                {t(
                  "Hubungi tim kami untuk memperbarui informasi profil Anda.",
                  "Contact our team to update your profile information."
                )}
              </p>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                  t("Halo, saya ingin memperbarui informasi profil saya.", "Hello, I would like to update my profile information.")
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 border border-stitch-primary text-stitch-primary rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-stitch-primary hover:text-white transition-all"
              >
                <Phone size={13} strokeWidth={1.5} />
                {t("Hubungi Tim FOR Vows", "Contact FOR Vows Team")}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <Loader2 size={24} className="text-stitch-primary animate-spin" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}