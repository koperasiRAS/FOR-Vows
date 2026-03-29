"use client";

import { useState } from "react";
import { Check, Copy, X, Loader } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n/context";
import { getSnapToken, openSnapPopup } from "@/lib/midtrans";

export function PaymentModal() {
  const { t } = useLanguage();
  const { bookings, closePayment, isPaymentOpen } = useCart();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

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
        amount: unpaidBooking.totalPrice,
        items: unpaidBooking.items.map((item) => ({
          name: item.name,
          price: item.priceValue,
          quantity: item.quantity,
        })),
      });

      await openSnapPopup(token);
      setShowSuccess(unpaidBooking.bookingId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      if (message.includes("popup ditutup") || message.includes("Popup ditutup")) {
        setShowSuccess(unpaidBooking.bookingId);
      } else {
        setPaymentError(message);
      }
    } finally {
      setPayingId(null);
    }
  };

  const getWhatsAppLink = () => {
    const waNumber = "6287779560264";
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(unpaidBooking.totalPrice);

    let message = `Halo FOR Vows! Saya ingin konfirmasi pembayaran:\n\n`;
    message += `Booking ID: ${unpaidBooking.bookingId}\n`;
    message += `Nama: ${unpaidBooking.name}\n`;
    message += `Total: ${formatted}\n\n`;
    message += `Mohon instruksi pembayaran. Terima kasih! 🙏`;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
        onClick={() => {}}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("payment.pilihMetode")}
          className="bg-[#0f0f0f] border border-white/[0.08] w-full max-w-lg pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <h2 className="font-serif text-lg text-[#faf8f5]">
              {showSuccess === unpaidBooking.bookingId
                ? t("payment.sesiPembayaran")
                : t("payment.pilihMetode")}
            </h2>
            <button
              onClick={() => {
                setShowSuccess(null);
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
          {showSuccess === unpaidBooking.bookingId ? (
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
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 text-[11px] tracking-widest uppercase bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
              >
                {t("payment.kirimBuktiWA")}
              </a>
              <button
                onClick={() => {
                  setShowSuccess(null);
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
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 text-[11px] tracking-widest uppercase border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t("payment.bayarNantiWA")}
                </a>

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
