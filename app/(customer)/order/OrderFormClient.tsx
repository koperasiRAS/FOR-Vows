"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Calendar, Check, Loader2, MapPin, User, Mail, Phone, Clock, Package, ChevronDown } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PACKAGES } from "@/lib/packages";
import { getTemplateBySlug } from "@/lib/templates";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { formatIDR } from "@/lib/utils";

// ── Template → Package auto-suggest map ────────────────────────────────────────
// Maps template slugs to their recommended package.
// Users can change the package before confirming.

const TEMPLATE_PACKAGE_MAP: Record<string, { packageKey: "basic" | "premium" | "exclusive"; templateName: string }> = {
  "floral-luxury":     { packageKey: "premium",  templateName: "Floral Luxury" },
  "eternal-gold":      { packageKey: "premium",  templateName: "Eternal Gold" },
  "ivory-elegance":    { packageKey: "premium",  templateName: "Ivory Elegance" },
  "nusantara-heritage":{ packageKey: "premium",  templateName: "Nusantara Heritage" },
  "javanese-symphony": { packageKey: "premium",  templateName: "Javanese Symphony" },
  "garden-terrace":    { packageKey: "basic",    templateName: "Garden Terrace" },
  "minimalist-romance":{ packageKey: "basic",    templateName: "Minimalist Romance" },
  "secret-garden":     { packageKey: "premium",  templateName: "Secret Garden" },
  "cozy-celebration":  { packageKey: "basic",    templateName: "Cozy Celebration" },
};

// ── Add-ons with prices ────────────────────────────────────────────────────────

const ADD_ONS: { id: string; label: string; labelEn: string; price: number }[] = [
  { id: "domain-custom",         label: "Domain Kustom (.com/.id)",     labelEn: "Custom Domain",        price: 250000 },
  { id: "express-delivery",      label: "Rush Delivery (48 jam)",        labelEn: "Express Delivery",     price: 100000 },
  { id: "premium-animation",     label: "Animasi Premium",               labelEn: "Premium Animation",    price: 75000  },
  { id: "extra-gallery",         label: "Gallery Extra (+20 foto)",      labelEn: "Extra Gallery",        price: 50000  },
  { id: "digital-gift-qr",       label: "QR Gift uang digital",          labelEn: "Digital Gift QR",      price: 25000  },
  { id: "custom-guest-link",     label: "Link tamu kustom",              labelEn: "Custom Guest Link",    price: 50000  },
];

// ── Zod schema ─────────────────────────────────────────────────────────────────

const orderSchema = z.object({
  packageKey:    z.enum(["basic", "premium", "exclusive"]),
  groomName:     z.string().min(2, "Nama minimal 2 karakter").max(100),
  brideName:     z.string().min(2, "Nama minimal 2 karakter").max(100),
  email:         z.string().email("Format email tidak valid").or(z.literal("")),
  phone:         z.string().min(8, "Nomor WhatsApp minimal 8 digit").regex(/^[\d\s+()-]+$/, "Format nomor tidak valid"),
  weddingDate:   z.string().min(1, "Tanggal pernikahan wajib diisi"),
  akadTime:      z.string().optional(),
  receptionTime: z.string().optional(),
  venue:         z.string().min(1, "Nama venue wajib diisi").max(200),
  venueAddress:  z.string().max(500).optional(),
  coupleStory:   z.string().max(1000).optional(),
  referralCode:  z.string().max(50).optional(),
  addOns:        z.array(z.string()).default([]),
});

type OrderFormData = z.infer<typeof orderSchema>;

// ── Step Indicator ─────────────────────────────────────────────────────────────

function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-10">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = current > num;
        const active = current === num;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all ${
                  done
                    ? "bg-[#c9a96e] text-[#0a0a0a]"
                    : active
                    ? "border-2 border-[#c9a96e] text-[#c9a96e]"
                    : "border border-white/10 text-[#4a4a4a]"
                }`}
              >
                {done ? <Check size={11} strokeWidth={3} /> : num}
              </div>
              <span className={`text-[10px] tracking-wide hidden sm:block ${
                active ? "text-[#c9a96e]" : done ? "text-[#6a6a6a]" : "text-[#3a3a3a]"
              }`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 h-px mx-1 mb-4 ${done ? "bg-[#c9a96e]/50" : "bg-white/8"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Add-on Toggle ─────────────────────────────────────────────────────────────

function AddOnToggle({
  id,
  label,
  price,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  price: number;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
}) {
  return (
    <label className={`flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer transition-all ${
      checked
        ? "border-[#c9a96e]/50 bg-[#c9a96e]/8"
        : "border-white/8 bg-[#141414] hover:border-white/20"
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
          checked ? "bg-[#c9a96e] border-[#c9a96e]" : "border-white/20"
        }`}>
          {checked && <Check size={10} className="text-[#0a0a0a]" strokeWidth={3} />}
        </div>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(id, e.target.checked)}
        />
        <span className="text-sm text-[#faf8f5]">{label}</span>
      </div>
      <span className="text-xs text-[#c9a96e] font-medium">
        +{formatIDR(price)}
      </span>
    </label>
  );
}

// ── Order Form (inner, uses useSearchParams) ────────────────────────────────────

function OrderFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateSlug = searchParams.get("template") ?? "";
  const initialPackage = searchParams.get("package") as "basic" | "premium" | "exclusive" | null;

  // Resolve package from template map first, then URL param, then default
  const templateInfo = TEMPLATE_PACKAGE_MAP[templateSlug];
  const suggestedPackage = templateInfo?.packageKey ?? initialPackage ?? "basic";

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "premium" | "exclusive">(suggestedPackage as "basic" | "premium" | "exclusive");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OrderFormData>({
    packageKey:    selectedPackage,
    groomName:    "",
    brideName:    "",
    email:        "",
    phone:        "",
    weddingDate:  "",
    akadTime:     "",
    receptionTime:"",
    venue:        "",
    venueAddress: "",
    coupleStory:  "",
    referralCode: "",
    addOns:       [],
  });

  // Update formData when package changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setFormData((prev) => ({ ...prev, packageKey: selectedPackage }));
  }, [selectedPackage]);

  // Validate step 1
  const canProceedStep1 = selectedPackage !== null;

  // Validate step 2
  const canProceedStep2 =
    formData.groomName.trim().length >= 2 &&
    formData.brideName.trim().length >= 2 &&
    formData.phone.trim().length >= 8 &&
    formData.weddingDate.trim().length > 0 &&
    formData.venue.trim().length >= 1;

  const selectedPkg = PACKAGES.find((p) => p.key === selectedPackage) ?? PACKAGES[1];
  const addOnTotal = selectedAddOns.reduce((sum, id) => {
    const addon = ADD_ONS.find((a) => a.id === id);
    return sum + (addon?.price ?? 0);
  }, 0);
  const totalPrice = selectedPkg.priceValue + addOnTotal;

  const handleAddOnChange = (id: string, checked: boolean) => {
    setSelectedAddOns((prev) =>
      checked ? [...prev, id] : prev.filter((a) => a !== id)
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug:    templateSlug || undefined,
          templateName:    templateInfo?.templateName ?? (templateSlug ? getTemplateBySlug(templateSlug)?.name : undefined),
          packageKey:      selectedPackage,
          groomName:      formData.groomName,
          brideName:      formData.brideName,
          email:          formData.email || undefined,
          phone:          formData.phone,
          eventDate:      formData.weddingDate,
          akadTime:       formData.akadTime || undefined,
          receptionTime:  formData.receptionTime || undefined,
          venue:          formData.venue,
          venueAddress:   formData.venueAddress || undefined,
          story:          formData.coupleStory || undefined,
          referralCode:   formData.referralCode || undefined,
          addOns:         selectedAddOns.length > 0 ? selectedAddOns : undefined,
          addOnTotal,
          totalAmount:    totalPrice,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.error ?? "Gagal membuat pesanan");
        return;
      }

      // Store for recent orders reference
      if (typeof window !== "undefined") {
        try {
          const existing = JSON.parse(localStorage.getItem("forvows_recent_orders") ?? "[]");
          const updated = [result.orderCode, ...existing].slice(0, 10);
          localStorage.setItem("forvows_recent_orders", JSON.stringify(updated));
        } catch { /* ignore */ }
      }

      // Navigate to success page — it handles Midtrans payment + manual fallback
      const paymentMethod = result.paymentMethod ?? "midtrans";
      router.push(
        `/order/success?order_id=${encodeURIComponent(result.orderCode)}&payment=${paymentMethod}`
      );
    } catch {
      toast.error("Koneksi bermasalah. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const STEPS = ["Paket", "Detail", "Review", "Pembayaran"];

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <div className="max-w-lg mx-auto px-6">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href={templateSlug ? `/templates` : "/templates"}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#6a6a6a] hover:text-[#c9a96e] transition-colors"
          >
            <ArrowLeft size={12} />
            {templateSlug ? "Kembali ke Template" : "Kembali"}
          </Link>
        </div>

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-2">
              FOR Vows
            </p>
            <h1 className="font-serif text-3xl lg:text-4xl text-[#faf8f5] mb-2">
              {step === 1 ? "Pilih Paket" :
               step === 2 ? "Detail Pernikahan" :
               step === 3 ? "Review Pesanan" :
               step === 4 ? "Pembayaran" :
               "Pemesanan Berhasil"}
            </h1>
            <p className="text-sm text-[#6a6a6a]">
              {templateSlug && templateInfo
                ? `Template: ${templateInfo.templateName}`
                : "Lengkapi data untuk membuat pesanan"}
            </p>
          </div>
        </ScrollReveal>

        {/* Step indicator — hidden on payment success */}
        {step < 5 && <StepIndicator current={step} steps={STEPS} />}

        {/* ── Step 1: Package Selection ─────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Template banner */}
            {templateInfo && (
              <div className="flex items-center gap-3 p-3 border border-[#c9a96e]/20 bg-[#c9a96e]/5 rounded-xl">
                <div
                  className="w-10 h-10 rounded border border-white/8 shrink-0"
                  style={{
                    background: templateSlug
                      ? `linear-gradient(135deg, ${getTemplateBySlug(templateSlug)?.gradientFrom ?? "#c9a96e"} 0%, ${getTemplateBySlug(templateSlug)?.gradientTo ?? "#c9a96e"} 100%)`
                      : "#c9a96e",
                  }}
                />
                <div>
                  <p className="text-[10px] text-[#6a6a6a] uppercase tracking-wider">Template Dipilih</p>
                  <p className="text-sm text-[#faf8f5] font-medium">{templateInfo.templateName}</p>
                  <p className="text-[10px] text-[#c9a96e]">
                    Direkomendasikan: Paket {selectedPkg.label}
                  </p>
                </div>
              </div>
            )}

            {/* Package cards */}
            <div>
              <p className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a] mb-3">
                Pilih Paket <span className="text-[#c9a96e]">*</span>
              </p>
              <div className="grid grid-cols-1 gap-3">
                {PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage === pkg.key;
                  const isSuggested = pkg.key === suggestedPackage;
                  return (
                    <button
                      key={pkg.key}
                      type="button"
                      onClick={() => setSelectedPackage(pkg.key as "basic" | "premium" | "exclusive")}
                      className={`relative p-5 border text-left transition-all duration-200 ${
                        isSelected
                          ? "border-[#c9a96e] bg-[#c9a96e]/8"
                          : "border-white/8 bg-[#141414] hover:border-white/20"
                      }`}
                    >
                      {pkg.featured && !isSelected && (
                        <span className="absolute -top-2.5 left-4 text-[9px] tracking-[0.2em] uppercase bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/30 px-2 py-0.5">
                          Populer
                        </span>
                      )}
                      {isSuggested && !pkg.featured && (
                        <span className="absolute -top-2.5 left-4 text-[9px] tracking-[0.2em] uppercase bg-[#c9a96e]/15 text-[#c9a96e]/80 border border-[#c9a96e]/25 px-2 py-0.5">
                          Rekomendasi
                        </span>
                      )}
                      <div className="flex items-start justify-between mt-2">
                        <div>
                          <p className="font-serif text-base text-[#faf8f5] mb-0.5">{pkg.label}</p>
                          <p className="text-[10px] text-[#6a6a6a]">
                            {pkg.key === "basic"     && "Template pilihan + fitur standar"}
                            {pkg.key === "premium"   && "Template premium + RSVP + kustomisasi"}
                            {pkg.key === "exclusive" && "Fully custom + dedicated support"}
                          </p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-lg font-medium text-[#c9a96e]">{pkg.priceLabel}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <div className="w-5 h-5 rounded-full bg-[#c9a96e] flex items-center justify-center">
                            <Check size={11} className="text-[#0a0a0a]" strokeWidth={3} />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => canProceedStep1 ? setStep(2) : toast.error("Pilih paket terlebih dahulu")}
              className="w-full py-4 flex items-center justify-center gap-2 bg-[#c9a96e] text-[#0a0a0a] text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-[#d4b87a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Lanjutkan
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ── Step 2: Wedding Details ───────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Package reminder */}
            <div className="flex items-center justify-between p-3 border border-[#c9a96e]/20 bg-[#c9a96e]/5 rounded-xl text-sm">
              <div className="flex items-center gap-2">
                <Package size={14} className="text-[#c9a96e]" />
                <span className="text-[#6a6a6a]">Paket:</span>
                <span className="text-[#faf8f5] font-medium">{selectedPkg.label}</span>
              </div>
              <span className="text-[#c9a96e] font-serif">{selectedPkg.priceLabel}</span>
            </div>

            {/* Couple names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  Nama Mempelai Pria <span className="text-[#c9a96e]">*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]" />
                  <input
                    type="text"
                    value={formData.groomName}
                    onChange={(e) => setFormData((p) => ({ ...p, groomName: e.target.value }))}
                    placeholder="Nama lengkap pria"
                    className="w-full pl-9 pr-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  Nama Mempelai Wanita <span className="text-[#c9a96e]">*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]" />
                  <input
                    type="text"
                    value={formData.brideName}
                    onChange={(e) => setFormData((p) => ({ ...p, brideName: e.target.value }))}
                    placeholder="Nama lengkap wanita"
                    className="w-full pl-9 pr-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="email@contoh.com"
                    className="w-full pl-9 pr-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  WhatsApp <span className="text-[#c9a96e]">*</span>
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="08xxxxxxxxxx"
                    className="w-full pl-9 pr-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Date & Times */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  Tanggal <span className="text-[#c9a96e]">*</span>
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]" />
                  <input
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => setFormData((p) => ({ ...p, weddingDate: e.target.value }))}
                    className="w-full pl-9 pr-3 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] focus:outline-none focus:border-[#c9a96e]/50 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  Jam Akad
                </label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]" />
                  <input
                    type="time"
                    value={formData.akadTime}
                    onChange={(e) => setFormData((p) => ({ ...p, akadTime: e.target.value }))}
                    className="w-full pl-9 pr-3 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] focus:outline-none focus:border-[#c9a96e]/50 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  Jam Resepsi
                </label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]" />
                  <input
                    type="time"
                    value={formData.receptionTime}
                    onChange={(e) => setFormData((p) => ({ ...p, receptionTime: e.target.value }))}
                    className="w-full pl-9 pr-3 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] focus:outline-none focus:border-[#c9a96e]/50 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Venue */}
            <div className="space-y-1.5">
              <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                Nama Venue <span className="text-[#c9a96e]">*</span>
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a4a]" />
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData((p) => ({ ...p, venue: e.target.value }))}
                  placeholder="Gedung Pernikahan / Hotel / Garden"
                  className="w-full pl-9 pr-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                />
              </div>
            </div>

            {/* Venue address */}
            <div className="space-y-1.5">
              <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                Alamat Venue
              </label>
              <textarea
                value={formData.venueAddress}
                onChange={(e) => setFormData((p) => ({ ...p, venueAddress: e.target.value }))}
                placeholder="Alamat lengkap venue..."
                rows={2}
                className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors resize-none"
              />
            </div>

            {/* Couple story */}
            <div className="space-y-1.5">
              <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                Kisah Cinta <span className="text-[#6a6a6a] font-normal">(opsional)</span>
              </label>
              <textarea
                value={formData.coupleStory}
                onChange={(e) => setFormData((p) => ({ ...p, coupleStory: e.target.value }))}
                placeholder="Ceritakan kisah singkat perjalanan cinta kalian..."
                rows={3}
                className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors resize-none"
              />
            </div>

            {/* Referral */}
            <div className="space-y-1.5">
              <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                Kode Referral <span className="text-[#6a6a6a] font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => setFormData((p) => ({ ...p, referralCode: e.target.value.toUpperCase() }))}
                placeholder="Contoh: FORVLAUNCH"
                className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors uppercase"
              />
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-4 border border-white/15 text-[#6a6a6a] text-[11px] tracking-[0.18em] uppercase hover:border-white/30 hover:text-[#8a8a8a] transition-colors"
              >
                <ArrowLeft size={14} className="inline mr-1" />
                Ubah Paket
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!canProceedStep2) {
                    toast.error("Mohon isi semua field yang wajib diisi (*)");
                    return;
                  }
                  setStep(3);
                }}
                className="flex-1 py-4 flex items-center justify-center gap-2 bg-[#c9a96e] text-[#0a0a0a] text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-[#d4b87a] transition-colors"
              >
                Lanjut ke Review
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review ─────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="border border-white/6 divide-y divide-white/5">
              {templateInfo && (
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-[11px] tracking-[0.1em] uppercase text-[#6a6a6a]">Template</span>
                  <span className="text-sm text-[#faf8f5]">{templateInfo.templateName}</span>
                </div>
              )}
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[11px] tracking-[0.1em] uppercase text-[#6a6a6a]">Paket</span>
                <span className="text-sm text-[#faf8f5]">{selectedPkg.label}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[11px] tracking-[0.1em] uppercase text-[#6a6a6a]">Mempelai</span>
                <span className="text-sm text-[#faf8f5]">{formData.groomName} & {formData.brideName}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[11px] tracking-[0.1em] uppercase text-[#6a6a6a]">Tanggal</span>
                <span className="text-sm text-[#faf8f5]">{formData.weddingDate}{formData.akadTime ? `, ${formData.akadTime}` : ""}{formData.receptionTime ? ` / ${formData.receptionTime}` : ""}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[11px] tracking-[0.1em] uppercase text-[#6a6a6a]">Venue</span>
                <span className="text-sm text-[#faf8f5] max-w-[60%] text-right">{formData.venue}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[11px] tracking-[0.1em] uppercase text-[#6a6a6a]">Kontak</span>
                <span className="text-sm text-[#faf8f5]">{formData.phone}</span>
              </div>
              {formData.coupleStory && (
                <div className="px-5 py-4">
                  <span className="text-[11px] tracking-[0.1em] uppercase text-[#6a6a6a] block mb-1">Kisah Cinta</span>
                  <p className="text-sm text-[#8a8a8a]">{formData.coupleStory}</p>
                </div>
              )}
            </div>

            {/* Add-ons */}
            <div>
              <p className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a] mb-3">
                Add-ons <span className="text-[#6a6a6a] font-normal normal-case">(opsional)</span>
              </p>
              <div className="space-y-2">
                {ADD_ONS.map((addon) => (
                  <AddOnToggle
                    key={addon.id}
                    id={addon.id}
                    label={addon.label}
                    price={addon.price}
                    checked={selectedAddOns.includes(addon.id)}
                    onChange={handleAddOnChange}
                  />
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-4 border border-[#c9a96e]/30 bg-[#c9a96e]/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  {selectedPkg.label} Package
                </span>
                <span className="text-sm text-[#faf8f5]">{selectedPkg.priceLabel}</span>
              </div>
              {addOnTotal > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#8a8a8a]">Add-ons</span>
                  <span className="text-sm text-[#faf8f5]">+{formatIDR(addOnTotal)}</span>
                </div>
              )}
              <div className="h-px bg-[#c9a96e]/20 my-3" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.1em] uppercase text-[#c9a96e]">Total</span>
                <span className="font-serif text-xl text-[#c9a96e]">{formatIDR(totalPrice)}</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-4 border border-white/15 text-[#6a6a6a] text-[11px] tracking-[0.18em] uppercase hover:border-white/30 hover:text-[#8a8a8a] transition-colors"
              >
                <ArrowLeft size={14} className="inline mr-1" />
                Ubah Data
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-4 flex items-center justify-center gap-2 bg-[#c9a96e] text-[#0a0a0a] text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-[#d4b87a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <><Loader2 size={14} className="animate-spin" />Menyimpan...</>
                ) : (
                  <>Buat Pesanan & Bayar<ArrowRight size={14} /></>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-[#4a4a4a]">
              Dengan menekan tombol di atas, kamu menyetujui Syarat & Ketentuan FOR Vows.
            </p>
          </div>
        )}

        {/* ── Step 4 & 5: Redirected to order-success ───────────────────── */}
        {/* (Step 4/5 are handled by OrderSuccess.tsx via router.push) */}
      </div>
    </div>
  );
}

// ── Page component (suspense boundary required for useSearchParams) ─────────────

export function OrderFormClient() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
          <Loader2 size={24} className="text-[#c9a96e] animate-spin" />
        </div>
      }
    >
      <OrderFormContent />
    </Suspense>
  );
}
