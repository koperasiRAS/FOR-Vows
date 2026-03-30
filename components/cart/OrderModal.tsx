"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Check, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/context";
import { useCart } from "@/lib/cart-context";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";
import { WA_NUMBER } from "@/lib/config";
import type { WeddingTemplate } from "@/types";


interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: WeddingTemplate | null;
}

interface OrderFormData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  phone: string;
  package: string;
  notes: string;
}

const PACKAGES = [
  { id: "basic", label: "Basic", price: "Rp 299.000", priceValue: 299000 },
  { id: "premium", label: "Premium", price: "Rp 599.000", priceValue: 599000 },
  { id: "exclusive", label: "Exclusive", price: "Rp 999.000", priceValue: 999000 },
];

export function OrderModal({ isOpen, onClose, template }: OrderModalProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { saveBooking, generateBookingId } = useCart();
  const modalRef = useFocusTrap(isOpen);
  const [step, setStep] = useState<"form" | "summary">("form");
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<OrderFormData>({
    groomName: "",
    brideName: "",
    weddingDate: "",
    phone: "",
    package: "premium",
    notes: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setStep("form");
      setOrderCode("");
      setSubmitting(false);
      setForm({
        groomName: "",
        brideName: "",
        weddingDate: "",
        phone: "",
        package: "premium",
        notes: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedPackage = PACKAGES.find((p) => p.id === form.package) ?? PACKAGES[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.groomName.trim() || !form.brideName.trim() || !form.phone.trim()) return;

    // Generate order code for immediate display and DB insert
    const code = generateBookingId();

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: code,
          groomName: form.groomName,
          brideName: form.brideName,
          template: template?.name ?? null,
          package: form.package,
          phone: form.phone,
          notes: form.notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setOrderCode(code);
        setStep("summary");
        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push(`/order-success?code=${encodeURIComponent(code)}`);
        }, 1500);
      } else {
        // DB insert returned success=false — notify user, still show local summary
        toast.error(data.error || "Gagal menyimpan pesanan ke server. Silakan hubungi admin via WhatsApp.");
        setOrderCode(code);
        setStep("summary");
      }
    } catch {
      // Network error — notify user and show local summary
      toast.error("Koneksi bermasalah. Pesanan Anda tetap bisa dilanjutkan via WhatsApp.");
      setOrderCode(code);
      setStep("summary");
    } finally {
      // Save to localStorage so WhatsAppPopup and other flows can find it.
      // This runs exactly once per submit attempt, regardless of API outcome.
      saveBooking({
        bookingId: code,
        name: `${form.groomName} & ${form.brideName}`,
        whatsapp: form.phone,
        referralCode: "",
        items: [
          {
            id: `pkg-${form.package}`,
            type: "package" as const,
            name: `${selectedPackage.label} Package`,
            price: selectedPackage.price,
            priceValue: selectedPackage.priceValue,
            quantity: 1,
          },
        ],
        totalPrice: selectedPackage.priceValue,
        discountAmount: 0,
        discountNote: undefined,
        finalTotal: selectedPackage.priceValue,
        createdAt: new Date().toISOString(),
        status: "pending",
      });
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = `Halo FOR Vows! Saya ingin memesan undangan pernikahan dengan detail berikut:

*Data Mempelai*
Nama Mempelai Pria: ${form.groomName}
Nama Mempelai Wanita: ${form.brideName}
Tanggal Pernikahan: ${form.weddingDate || "Belum ditentukan"}
No. WhatsApp: ${form.phone}

*Detail Pesanan*
Template: ${template?.name ?? "-"}
Paket: ${selectedPackage.label} - ${selectedPackage.price}
Kode Pesanan: ${orderCode}

${form.notes ? `*Catatan:*\n${form.notes}` : ""}

Mohon informasi lengkap untuk pembayaran. Terima kasih! 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const categoryLabel = template
    ? t(`templates.categories.${template.category}` as const)
    : "";

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClose(); }}
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-modal-title"
          className="bg-[#0f0f0f] border border-white/[0.08] w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-[#0f0f0f]">
            <div>
              <h2 id="order-modal-title" className="font-serif text-lg text-[#faf8f5]">
                {step === "form" ? t("order.title") : t("order.summaryTitle")}
              </h2>
              {step === "form" && template && (
                <p className="text-xs text-[#c9a96e] mt-0.5 truncate">
                  {template.name} — {categoryLabel}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#6a6a6a] hover:text-[#faf8f5] transition-colors"
              aria-label={t("order.close")}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Step */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Template Preview */}
              {template && (
                <div className="p-4 border border-[#c9a96e]/20 bg-[#c9a96e]/5 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded border border-white/[0.08] shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${template.gradientFrom} 0%, ${template.gradientTo} 100%)`,
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#faf8f5] truncate">{template.name}</p>
                    <p className="text-xs text-[#c9a96e]">{categoryLabel}</p>
                  </div>
                </div>
              )}

              {/* Bride & Groom */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="order-groom" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                    {t("order.groomName")} <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    id="order-groom"
                    type="text"
                    value={form.groomName}
                    onChange={(e) => setForm((f) => ({ ...f, groomName: e.target.value }))}
                    placeholder={t("order.groomPlaceholder")}
                    required
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="order-bride" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                    {t("order.brideName")} <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    id="order-bride"
                    type="text"
                    value={form.brideName}
                    onChange={(e) => setForm((f) => ({ ...f, brideName: e.target.value }))}
                    placeholder={t("order.bridePlaceholder")}
                    required
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>
              </div>

              {/* Wedding Date */}
              <div className="space-y-1.5">
                <label htmlFor="order-date" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  {t("order.weddingDate")}
                </label>
                <div className="relative">
                  <input
                    id="order-date"
                    type="date"
                    value={form.weddingDate}
                    onChange={(e) => setForm((f) => ({ ...f, weddingDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors [color-scheme:dark]"
                  />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a] pointer-events-none" />
                </div>
              </div>

              {/* Package Selection */}
              <div className="space-y-2">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  {t("order.package")} <span className="text-[#c9a96e]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, package: pkg.id }))}
                      aria-label={`${pkg.label} — ${pkg.price}`}
                      aria-pressed={form.package === pkg.id}
                      className={`p-3 text-center border transition-all duration-200 ${
                        form.package === pkg.id
                          ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#faf8f5]"
                          : "border-white/[0.07] bg-[#141414] text-[#8a8a8a] hover:border-white/[0.15]"
                      }`}
                    >
                      <p className="text-xs font-medium">{pkg.label}</p>
                      <p className="text-[10px] mt-0.5 text-[#c9a96e]">{pkg.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="order-phone" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  {t("order.phone")} <span className="text-[#c9a96e]">*</span>
                </label>
                <input
                  id="order-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder={t("order.phonePlaceholder")}
                  required
                  className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label htmlFor="order-notes" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  {t("order.notes")}
                </label>
                <textarea
                  id="order-notes"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder={t("order.notesPlaceholder")}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors resize-none"
                />
              </div>

              {/* Info note */}
              <div className="p-4 border border-white/[0.05] bg-[#0a0a0a]">
                <p className="text-xs text-[#6a6a6a] leading-relaxed">
                  <span className="text-[#c9a96e]">{t("order.infoLabel")}:</span>{" "}
                  {t("order.infoText")}
                </p>
              </div>

              {/* Submit */}
              <WhatsAppButton
                type="submit"
                label={submitting ? t("order.submitting") : t("order.sendWhatsApp")}
                disabled={!form.groomName.trim() || !form.brideName.trim() || !form.phone.trim() || submitting}
                className="py-4"
              />
            </form>
          )}

          {/* Summary Step */}
          {step === "summary" && (
            <div className="p-6 space-y-6">
              {/* Success icon */}
              <div className="flex flex-col items-center text-center gap-3 pt-2">
                <div className="w-14 h-14 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center">
                  <Check size={24} className="text-[#c9a96e]" />
                </div>
                <div>
                  <p className="font-serif text-xl text-[#faf8f5]">{t("order.orderCreated")}</p>
                  <p className="text-xs text-[#6a6a6a] mt-1">{t("order.orderCreatedDesc")}</p>
                </div>
              </div>

              {/* Order Code */}
              <div className="p-4 border border-[#c9a96e]/20 bg-[#c9a96e]/5 text-center">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#c9a96e] mb-2">
                  {t("order.orderCode")}
                </p>
                <p className="font-mono text-xl text-[#c9a96e] tracking-wider">
                  {orderCode}
                </p>
              </div>

              {/* Order Summary */}
              <div className="border border-white/[0.06] divide-y divide-white/[0.04]">
                <div className="px-4 py-3">
                  <p className="text-[10px] tracking-[0.1em] uppercase text-[#6a6a6a] mb-1">{t("order.template")}</p>
                  <p className="text-sm text-[#faf8f5]">{template?.name ?? "-"}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[10px] tracking-[0.1em] uppercase text-[#6a6a6a] mb-1">{t("order.groomName")}</p>
                  <p className="text-sm text-[#faf8f5]">{form.groomName} & {form.brideName}</p>
                </div>
                {form.weddingDate && (
                  <div className="px-4 py-3">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-[#6a6a6a] mb-1">{t("order.weddingDate")}</p>
                    <p className="text-sm text-[#faf8f5]">{form.weddingDate}</p>
                  </div>
                )}
                <div className="px-4 py-3">
                  <p className="text-[10px] tracking-[0.1em] uppercase text-[#6a6a6a] mb-1">{t("order.package")}</p>
                  <p className="text-sm text-[#c9a96e]">{selectedPackage.label} — {selectedPackage.price}</p>
                </div>
                <div className="px-4 py-3 bg-[#141414]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8a8a8a]">{t("order.total")}</span>
                    <span className="font-serif text-lg text-[#faf8f5]">{selectedPackage.price}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <WhatsAppButton
                as="a"
                href="#"
                onClick={() => { handleWhatsApp(); }}
                label={t("order.contactAdmin")}
                className="py-4"
              />

              <button
                onClick={onClose}
                className="w-full text-center text-xs text-[#6a6a6a] hover:text-[#8a8a8a] transition-colors py-1"
              >
                {t("order.close")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
