"use client";

import { useState } from "react";
import { Check, Copy, X, Loader } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n/context";
import { getSnapToken, openSnapPopup } from "@/lib/midtrans";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";
import { WA_NUMBER } from "@/lib/config";
import { formatIDR } from "@/lib/utils";


export function PaymentModal() {
  const { t } = useLanguage();
  const { bookings, closePayment, isPaymentOpen } = useCart();
  const modalRef = useFocusTrap(isPaymentOpen);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Only render when payment modal is explicitly open
  if (!isPaymentOpen) return null;

  const unpaidBooking = [...bookings]
    .reverse()
    .find((b) => b.status === "pending");

  if (!unpaidBooking) return null;

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMidtransPayment = async () => {
    setPaymentError(null);
    setPayingId(unpaidBooking.bookingId);

    try {
      const { token } = await getSnapToken({
        bookingId: unpaidBooking.bookingId,
        customerName: unpaidBooking.name,
        customerEmail: `${unpaidBooking.bookingId}@forvows.com`,
        customerPhone: unpaidBooking.whatsapp,
        amount: unpaidBooking.finalTotal,
        items: unpaidBooking.items.map((item) => ({
          name: item.name,
          price: item.priceValue,
          quantity: item.quantity,
        })),
      });

      await openSnapPopup(token);
      setShowSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      if (message.includes("popup ditutup") || message.includes("Popup ditutup")) {
        setShowSuccess(true);
      } else {
        setPaymentError(message);
      }
    } finally {
      setPayingId(null);
    }
  };

  const getWhatsAppLink = () => {
    const { finalTotal, totalPrice, discountAmount } = unpaidBooking;

    let message = `Halo FOR Vows! Saya ingin konfirmasi pembayaran:\n\n`;
    message += `Booking ID: ${unpaidBooking.bookingId}\n`;
    message += `Nama: ${unpaidBooking.name}\n`;
    if (discountAmount && discountAmount > 0) {
      message += `Subtotal: ${formatIDR(totalPrice)}\n`;
      message += `Diskon: -${formatIDR(discountAmount)}\n`;
    }
    message += `Total: ${formatIDR(finalTotal)}\n\n`;
    message += `Mohon instruksi pembayaran. Terima kasih! 🙏`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm cursor-pointer"
        onClick={() => {
          setShowSuccess(false);
          setPaymentError(null);
          closePayment();
        }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-modal-title"
          className="bg-[#0f0f0f] border border-white/[0.08] w-full max-w-lg pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <h2 id="payment-modal-title" className="font-serif text-lg text-[#faf8f5]">
              {/* title based on success state */}
          {showSuccess
            ? t("payment.sesiPembayaran")
            : t("payment.pilihMetode")}
            </h2>
            <button
              onClick={() => {
                setShowSuccess(false);
                setPaymentError(null);
                closePayment();
              }}
              className="text-[#6a6a6a] hover:text-[#faf8f5] transition-colors"
              aria-label={t("booking.tutup")}
            >
              <X size={20} />
            </button>
          </div>

          {/* Success state */}
          {showSuccess ? (
            <div className="p-6 space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center mx-auto">
                <Check size={28} className="text-[#c9a96e]" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#faf8f5]">{t("payment.sesiPembayaran")}</h3>
                <p className="text-sm text-[#6a6a6a] mt-1">
                  {t("payment.buktiBayarInfo")}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 border border-[#c9a96e]/20 bg-[#c9a96e]/5">
                <span className="font-mono text-lg text-[#c9a96e] tracking-wider">
                  {unpaidBooking.bookingId}
                </span>
                <button
                  onClick={() => handleCopy(unpaidBooking.bookingId)}
                  className="text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors"
                  aria-label={t("payment.salin")}
                >
                  <Copy size={16} />
                </button>
                {copiedId === unpaidBooking.bookingId && (
                  <span className="text-xs text-[#c9a96e]">{t("payment.tersalin")}</span>
                )}
              </div>
              <WhatsAppButton
                as="a"
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                label={t("payment.kirimBuktiWA")}
                className="py-3.5"
              />
              <button
                onClick={() => {
                  setShowSuccess(false);
                  closePayment();
                }}
                className="w-full text-center text-xs text-[#6a6a6a] hover:text-[#8a8a8a] transition-colors"
              >
                {t("booking.tutup")}
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {/* Booking ID */}
              <div className="flex items-center justify-between p-4 border border-[#c9a96e]/20 bg-[#c9a96e]/5">
                <div>
                  <p className="text-[10px] text-[#c9a96e] uppercase tracking-wider mb-1">
                    {t("payment.bookingId")}
                  </p>
                  <p className="font-mono text-sm text-[#faf8f5]">
                    {unpaidBooking.bookingId}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(unpaidBooking.bookingId)}
                  className="text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors"
                  aria-label={t("payment.salin")}
                >
                  <Copy size={16} />
                </button>
                {copiedId === unpaidBooking.bookingId && (
                  <span className="text-xs text-[#c9a96e] animate-fade-in">
                    {t("payment.tersalin")}
                  </span>
                )}
              </div>

              {/* Order recap */}
              <div className="border border-white/[0.06] divide-y divide-white/[0.04]">
                {unpaidBooking.items.map((item) => (
                  <div key={item.id} className="flex justify-between px-4 py-3">
                    <p className="text-sm text-[#faf8f5]">{item.name}</p>
                    <p className="text-sm text-[#c9a96e]">{item.price}</p>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-3 bg-[#141414]">
                  <span className="text-sm text-[#8a8a8a]">{t("payment.total")}</span>
                  <span className="font-serif text-base text-[#faf8f5]">
                {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(unpaidBooking.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Payment options */}
              <div className="space-y-3">
                <p className="text-[10px] text-[#6a6a6a] uppercase tracking-wider text-center">
                  {t("payment.pilihMetodeBayar")}
                </p>

                {/* Midtrans */}
                <button
                  onClick={handleMidtransPayment}
                  disabled={payingId !== null}
                  className="w-full flex items-center justify-center gap-2.5 py-4 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] disabled:opacity-60 transition-colors"
                >
                  {payingId === unpaidBooking.bookingId ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      {t("payment.membukaPembayaran")}
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                      </svg>
                      {t("payment.bayarSekarang")}
                    </>
                  )}
                </button>

                {/* WhatsApp fallback */}
                <WhatsAppButton
                  as="a"
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  label={t("payment.bayarNantiWA")}
                  className="py-3.5 bg-transparent border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 hover:bg-[#20bd5a]" 
                />

                {paymentError && (
                  <p className="text-xs text-red-400 text-center">{paymentError}</p>
                )}
              </div>

              <p className="text-center text-xs text-[#5a5a5a]">
                {t("payment.infoMidtrans")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
