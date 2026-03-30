"use client";

import { useState, useCallback } from "react";
import { X, Check, Copy } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";
import { formatIDR } from "@/lib/utils";
import type { CartItem } from "@/lib/cart-context";
import {
  validateReferralCode,
  calculateDiscount,
  formatDiscount,
  type ReferralValidation,
} from "@/lib/referrals";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: { name: string; whatsapp: string; referralCode: string };
  bookingId: string;
  items: CartItem[];
  totalPrice: number;
  onSubmit: (data: { name: string; whatsapp: string; referralCode: string }) => void;
  onSaveAndSend: (discountAmount: number, discountNote: string | undefined) => void;
  getWhatsAppLink: (
    items: CartItem[],
    customer: { name: string; whatsapp: string; referralCode: string },
    bookingId: string,
    discountAmount?: number,
    discountNote?: string
  ) => string;
}

export function BookingModal({
  isOpen,
  onClose,
  customerData,
  bookingId,
  items,
  totalPrice,
  onSubmit,
  onSaveAndSend,
  getWhatsAppLink,
}: BookingModalProps) {
  const { t, lang } = useLanguage();
  const [name, setName] = useState(customerData.name);
  const [whatsapp, setWhatsapp] = useState(customerData.whatsapp);
  const [referralCode, setReferralCode] = useState(customerData.referralCode);
  const [step, setStep] = useState<"form" | "success">("form");
  const [copied, setCopied] = useState(false);
  const [referralValidation, setReferralValidation] = useState<ReferralValidation | null>(null);

  // Compute discount whenever the referral code changes
  const discount = referralCode.trim()
    ? calculateDiscount(totalPrice, referralCode)
    : null;

  const handleReferralChange = useCallback(
    (value: string) => {
      const upper = value.toUpperCase();
      setReferralCode(upper);
      if (!upper.trim()) {
        setReferralValidation(null);
        return;
      }
      const result = validateReferralCode(upper);
      setReferralValidation(result);
    },
    []
  );

  const discountAmount = discount?.amount ?? 0;
  const finalTotal = totalPrice - discountAmount;

  const fmt = formatIDR;

  const getTypeLabel = (type: string) => {
    if (type === "template") return t("booking.template");
    if (type === "package") return t("booking.paket");
    if (type === "addon") return t("booking.addon");
    if (type === "save_the_date") return t("booking.saveTheDate");
    if (type === "website") return t("booking.website");
    return type;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;
    onSubmit({ name: name.trim(), whatsapp: whatsapp.trim(), referralCode: referralCode.trim() });

    // Build discount note for WhatsApp if referral is valid
    let discountNote: string | undefined;
    if (referralValidation?.valid && referralValidation.referral) {
      discountNote = `${referralValidation.code} - ${formatDiscount(referralValidation.referral, lang)}`;
    }
    onSaveAndSend(discountAmount, discountNote);
    setStep("success");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep("form");
    setName("");
    setWhatsapp("");
    setReferralCode("");
    setReferralValidation(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label={t("booking.tutup")}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClose(); }}
        onClick={handleClose}
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("booking.lengkapiData")}
          className="bg-[#0f0f0f] border border-white/[0.08] w-full max-w-lg pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div>
              <h2 className="font-serif text-lg text-[#faf8f5]">
                {step === "form" ? t("booking.lengkapiData") : t("booking.bookingBerhasil")}
              </h2>
              {step === "form" && (
                <p className="text-xs text-[#6a6a6a] mt-0.5">
                  {t("booking.dataInfo")}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-[#6a6a6a] hover:text-[#faf8f5] transition-colors"
              aria-label={t("booking.tutup")}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Step */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Booking ID Preview */}
              <div className="p-4 border border-[#c9a96e]/20 bg-[#c9a96e]/5">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#c9a96e] mb-1">
                  {t("booking.invoiceIdPreview")}
                </p>
                <p className="font-mono text-sm text-[#faf8f5]">
                  {bookingId}
                </p>
              </div>

              {/* Order Summary */}
              <div className="space-y-2">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#8a8a8a]">
                  {t("booking.ringkasanPesanan")}
                </p>
                <div className="border border-white/[0.06] divide-y divide-white/[0.04]">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm text-[#faf8f5]">{item.name}</p>
                        <p className="text-[10px] text-[#6a6a6a]">
                          {getTypeLabel(item.type)}
                        </p>
                      </div>
                      <p className="text-sm text-[#c9a96e]">{item.price}</p>
                    </div>
                  ))}
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-[#c9a96e]/5">
                      <div>
                        <p className="text-sm text-[#c9a96e]">{t("booking.referralDiscount")}</p>
                        {referralValidation?.valid && referralValidation.referral && (
                          <p className="text-[10px] text-[#c9a96e]/70">
                            {t("booking.referralBy", { referrer: referralValidation.referral.referrerName })}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-[#c9a96e]">-{fmt(discountAmount)}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#141414]">
                    <span className="text-sm text-[#8a8a8a]">{t("booking.total")}</span>
                    <span className="font-serif text-lg text-[#faf8f5]">{fmt(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="booking-name" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                    {t("booking.namaLengkap")} <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("booking.namaLengkapPlaceholder")}
                    required
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="booking-wa" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                    {t("booking.noWhatsapp")} <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    id="booking-wa"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder={t("booking.waPlaceholder")}
                    required
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="booking-referral" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                    {t("booking.kodeReferral")}
                  </label>
                  <input
                    id="booking-referral"
                    type="text"
                    value={referralCode}
                    onChange={(e) => handleReferralChange(e.target.value)}
                    placeholder={t("booking.referralPlaceholder")}
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors uppercase tracking-wider font-mono"
                  />
                  {/* Referral feedback */}
                  {referralCode.trim() && (
                    <p
                      className={`text-[10px] tracking-wide ${
                        referralValidation?.valid
                          ? "text-[#c9a96e]"
                          : "text-red-400"
                      }`}
                    >
                      {referralValidation?.valid
                        ? `✓ ${t("booking.referralValid")}${referralValidation.referral ? ` - ${formatDiscount(referralValidation.referral, lang)}` : ""}`
                        : `✗ ${t("booking.referralInvalid")}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 border border-white/[0.05] bg-[#0a0a0a]">
                <p className="text-xs text-[#6a6a6a] leading-relaxed">
                  <span className="text-[#c9a96e]">Info:</span> {t("booking.infoBooking")}
                </p>
              </div>

              {/* Submit */}
              <WhatsAppButton
                type="submit"
                label={t("booking.kirimWhatsApp")}
                disabled={!name.trim() || !whatsapp.trim()}
                className="py-4"
              />
            </form>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center gap-4 pt-4">
                <div className="w-16 h-16 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center">
                  <Check size={28} className="text-[#c9a96e]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#faf8f5]">{t("booking.bookingId")}</h3>
                  <p className="text-xs text-[#6a6a6a] mt-1">
                    {t("booking.simpanId")}
                  </p>
                </div>
                <div className="flex items-center gap-3 p-4 border border-[#c9a96e]/20 bg-[#c9a96e]/5 w-full justify-center">
                  <span className="font-mono text-xl text-[#c9a96e] tracking-wider">
                    {bookingId}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors"
                    aria-label={t("booking.salin")}
                  >
                    <Copy size={16} />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-[#c9a96e]">{t("booking.tersalin")}</p>
                )}
              </div>

              {/* Order recap */}
              <div className="border border-white/[0.06] divide-y divide-white/[0.04]">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3">
                    <p className="text-sm text-[#faf8f5]">{item.name}</p>
                    <p className="text-sm text-[#c9a96e]">{item.price}</p>
                  </div>
                ))}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between px-4 py-3 bg-[#c9a96e]/5">
                    <span className="text-sm text-[#c9a96e]">{t("booking.referralDiscount")}</span>
                    <span className="text-sm text-[#c9a96e]">-{fmt(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between px-4 py-3 bg-[#141414]">
                  <span className="text-sm text-[#8a8a8a]">{t("booking.total")}</span>
                  <span className="font-serif text-lg text-[#faf8f5]">{fmt(finalTotal)}</span>
                </div>
              </div>

              {/* Customer info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] text-[#6a6a6a] uppercase tracking-wider">{t("booking.nama")}</p>
                  <p className="text-[#faf8f5]">{name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6a6a6a] uppercase tracking-wider">{t("booking.whatsapp")}</p>
                  <p className="text-[#faf8f5]">{whatsapp}</p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <WhatsAppButton
                as="a"
                href={getWhatsAppLink(
                  items,
                  { name, whatsapp, referralCode },
                  bookingId,
                  discountAmount
                )}
                target="_blank"
                rel="noopener noreferrer"
                label={t("booking.kirimPesananWA")}
                className="py-4"
              />

              {/* Next steps */}
              <div className="p-4 border border-white/[0.05] bg-[#0a0a0a] space-y-2">
                <p className="text-xs text-[#8a8a8a] leading-relaxed">
                  <span className="text-[#c9a96e]">{t("booking.langkahSelanjutnya")}</span>
                </p>
                <ol className="text-xs text-[#6a6a6a] space-y-1 list-decimal list-inside">
                  <li>{t("booking.langkah1")}</li>
                  <li>{t("booking.langkah2")}</li>
                  <li>{t("booking.langkah3")}</li>
                  <li>{t("booking.langkah4")}</li>
                </ol>
              </div>

              <button
                onClick={handleClose}
                className="w-full text-center text-xs text-[#6a6a6a] hover:text-[#8a8a8a] transition-colors"
              >
                {t("booking.tutup")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
