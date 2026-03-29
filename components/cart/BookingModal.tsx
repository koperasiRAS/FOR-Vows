"use client";

import { useState } from "react";
import { X, Check, Copy } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: { name: string; whatsapp: string; referralCode: string };
  bookingId: string;
  items: Array<{
    id: string;
    name: string;
    type: string;
    price: string;
    priceValue: number;
    quantity: number;
  }>;
  totalPrice: number;
  onSubmit: (data: { name: string; whatsapp: string; referralCode: string }) => void;
  onSaveAndSend: () => void;
  getWhatsAppLink: (customer: { name: string; whatsapp: string; referralCode: string }, bookingId: string) => string;
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
  const [name, setName] = useState(customerData.name);
  const [whatsapp, setWhatsapp] = useState(customerData.whatsapp);
  const [referralCode, setReferralCode] = useState(customerData.referralCode);
  const [step, setStep] = useState<"form" | "success">("form");
  const [copied, setCopied] = useState(false);

  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(totalPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;
    onSubmit({ name: name.trim(), whatsapp: whatsapp.trim(), referralCode: referralCode.trim() });
    onSaveAndSend();
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
    onClose();
  };

  const getTypeLabel = (type: string) =>
    type === "template" ? "Template" : type === "package" ? "Paket" : "Add-on";

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Tutup"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClose(); }}
        onClick={handleClose}
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Form pemesanan"
          className="bg-[#0f0f0f] border border-white/[0.08] w-full max-w-lg pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div>
              <h2 className="font-serif text-lg text-[#faf8f5]">
                {step === "form" ? "Lengkapi Data Pemesanan" : "Booking Berhasil!"}
              </h2>
              {step === "form" && (
                <p className="text-xs text-[#6a6a6a] mt-0.5">
                  Data ini akan digunakan untuk konfirmasi dan generate invoice
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-[#6a6a6a] hover:text-[#faf8f5] transition-colors"
              aria-label="Tutup"
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
                  Invoice ID (akan digenerate)
                </p>
                <p className="font-mono text-sm text-[#faf8f5]">
                  {bookingId}
                </p>
              </div>

              {/* Order Summary */}
              <div className="space-y-2">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#8a8a8a]">
                  Ringkasan Pesanan
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
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-[#141414]">
                  <span className="text-sm text-[#8a8a8a]">Total</span>
                  <span className="font-serif text-lg text-[#faf8f5]">{formattedTotal}</span>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="booking-name" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                    Nama Lengkap <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    required
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="booking-wa" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                    No. WhatsApp <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    id="booking-wa"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+62 8xx xxxx xxxx"
                    required
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="booking-referral" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                    Kode Referral{" "}
                    <span className="text-[#5a5a5a] font-normal normal-case tracking-normal">
                      (opsional)
                    </span>
                  </label>
                  <input
                    id="booking-referral"
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: ANISA2026"
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-4 border border-white/[0.05] bg-[#0a0a0a]">
                <p className="text-xs text-[#6a6a6a] leading-relaxed">
                  <span className="text-[#c9a96e]">Info:</span> Setelah Anda mengirim pesan via WhatsApp, tim FOR Vows akan mengirimkan instruksi pembayaran dalam 24 jam. Mohon screeshot bukti transfer saat sudah bayar.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!name.trim() || !whatsapp.trim()}
                className="w-full flex items-center justify-center gap-2 py-4 text-[11px] tracking-widest uppercase bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Kirim via WhatsApp
              </button>
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
                  <h3 className="font-serif text-2xl text-[#faf8f5]">Booking ID</h3>
                  <p className="text-xs text-[#6a6a6a] mt-1">
                    Simpan ID ini untuk konfirmasi pembayaran
                  </p>
                </div>
                <div className="flex items-center gap-3 p-4 border border-[#c9a96e]/20 bg-[#c9a96e]/5 w-full justify-center">
                  <span className="font-mono text-xl text-[#c9a96e] tracking-wider">
                    {bookingId}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors"
                    aria-label="Salin"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-[#c9a96e]">Tersalin!</p>
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
                <div className="flex items-center justify-between px-4 py-3 bg-[#141414]">
                  <span className="text-sm text-[#8a8a8a]">Total</span>
                  <span className="font-serif text-lg text-[#faf8f5]">{formattedTotal}</span>
                </div>
              </div>

              {/* Customer info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] text-[#6a6a6a] uppercase tracking-wider">Nama</p>
                  <p className="text-[#faf8f5]">{name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6a6a6a] uppercase tracking-wider">WhatsApp</p>
                  <p className="text-[#faf8f5]">{whatsapp}</p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppLink(
                  { name, whatsapp, referralCode },
                  bookingId
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-4 text-[11px] tracking-widest uppercase bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Kirim Pesanan via WhatsApp
              </a>

              {/* Next steps */}
              <div className="p-4 border border-white/[0.05] bg-[#0a0a0a] space-y-2">
                <p className="text-xs text-[#8a8a8a] leading-relaxed">
                  <span className="text-[#c9a96e]">Langkah selanjutnya:</span>
                </p>
                <ol className="text-xs text-[#6a6a6a] space-y-1 list-decimal list-inside">
                  <li>Klik tombol di atas untuk kirim pesanan via WhatsApp</li>
                  <li>Tim FOR Vows akan kirim instruksi pembayaran</li>
                  <li>Transfer ke rekening yang tertera</li>
                  <li>Kirim bukti transfer via WhatsApp dengan menyertakan Booking ID</li>
                </ol>
              </div>

              <button
                onClick={handleClose}
                className="w-full text-center text-xs text-[#6a6a6a] hover:text-[#8a8a8a] transition-colors"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
