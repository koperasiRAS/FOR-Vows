"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WA_NUMBER } from "@/lib/config";

interface WhatsAppPopupProps {
  orderCode: string;
  groomName: string;
  brideName: string;
  template: string | null;
  packageName: string | null;
}

export function WhatsAppPopup({
  orderCode,
  groomName,
  brideName,
  template,
  packageName,
}: WhatsAppPopupProps) {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Show popup after a short delay (user reads the page first)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  // Check if already dismissed this session
  useEffect(() => {
    const dismissedKey = `wa_popup_dismissed_${orderCode}`;
    if (sessionStorage.getItem(dismissedKey)) {
      setDismissed(true);
    }
  }, [orderCode]);

  // Close on Escape key
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [visible]);

  // Focus first element when visible
  useEffect(() => {
    if (visible && popupRef.current) {
      const first = popupRef.current.querySelector<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem(`wa_popup_dismissed_${orderCode}`, "1");
  };

  const message = `Halo FOR Vows! Saya sudah membuat pesanan dengan detail berikut:

*Kode Pesanan:* ${orderCode}
*Mempelai:* ${groomName} & ${brideName}
${template ? `*Template:* ${template}` : ""}
${packageName ? `*Paket:* ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}` : ""}

Mohon info lebih lanjut untuk pembayaran dan validasi pesanan. Terima kasih! 🙏`;

  if (dismissed) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleDismiss}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        aria-live="polite"
        aria-label={lang === "id" ? "Pesanan berhasil dibuat" : "Order created"}
        className={`fixed z-[110] bottom-6 right-6 left-6 sm:left-auto sm:w-80 bg-[#0f0f0f] border border-[#c9a96e]/20 shadow-2xl transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center shrink-0 mt-0.5">
              <WhatsAppIcon size={16} color="#25D366" />
            </div>
            <div>
              <p className="font-serif text-sm text-[#faf8f5] leading-snug">
                {lang === "id"
                  ? "Pesanan berhasil dibuat!"
                  : "Order created successfully!"}
              </p>
              <p className="text-xs text-[#6a6a6a] mt-0.5 leading-relaxed">
                {lang === "id"
                  ? "Hubungi admin untuk validasi lebih cepat."
                  : "Contact admin for faster validation."}
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-[#6a6a6a] hover:text-[#faf8f5] transition-colors shrink-0 mt-0.5"
            aria-label={lang === "id" ? "Tutup" : "Close"}
          >
            <X size={16} />
          </button>
        </div>

        {/* Order Code */}
        <div className="px-5 pb-3">
          <p className="font-mono text-xs text-[#c9a96e] bg-[#c9a96e]/5 border border-[#c9a96e]/10 px-2.5 py-1.5 inline-block">
            {orderCode}
          </p>
        </div>

        {/* WhatsApp Button */}
        <div className="px-5 pb-5">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDismiss}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-[10px] tracking-widest uppercase bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
          >
            <WhatsAppIcon size={14} />
            {lang === "id"
              ? "Hubungi Admin via WhatsApp"
              : "Contact Admin via WhatsApp"}
          </a>
        </div>
      </div>
    </>
  );
}
