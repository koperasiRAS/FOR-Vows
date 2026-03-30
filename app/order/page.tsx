"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Calendar, Check, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PACKAGES } from "@/lib/packages";
import { getTemplateBySlug } from "@/lib/templates";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { formatIDR } from "@/lib/utils";

// ── Zod Schema ────────────────────────────────────────────────────────────────

const orderSchema = z.object({
  packageKey: z
    .union([z.literal("basic"), z.literal("premium"), z.literal("exclusive")])
    .readonly(),
  groomName: z.string().min(2, "Nama minimal 2 karakter").max(100),
  brideName: z.string().min(2, "Nama minimal 2 karakter").max(100),
  eventDate: z.string().optional(),
  phone: z
    .string()
    .min(8, "Nomor WhatsApp minimal 8 digit")
    .regex(/^[\d\s+()-]+$/, "Format nomor tidak valid"),
  story: z.string().max(2000).optional(),
  referralCode: z.string().max(50).optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

// ── Step Indicator ─────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all ${
              step === current
                ? "bg-[#c9a96e] text-[#0a0a0a]"
                : "border border-white/20 text-[#6a6a6a]"
            }`}
          >
            {step < current ? <Check size={12} /> : step}
          </div>
          <span
            className={`text-xs tracking-wide hidden sm:block ${
              step === current ? "text-[#faf8f5]" : "text-[#6a6a6a]"
            }`}
          >
            {step === 1 ? "Paket" : "Data Mempelai"}
          </span>
          {step < 2 && (
            <div className="w-8 h-px bg-white/10 hidden sm:block" />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Package Card Selector ──────────────────────────────────────────────────────

function PackageSelector({
  value,
  onChange,
}: {
  value?: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {PACKAGES.map((pkg) => (
        <button
          key={pkg.key}
          type="button"
          onClick={() => onChange(pkg.key)}
          className={`relative p-5 border text-left transition-all duration-200 ${
            value === pkg.key
              ? "border-[#c9a96e] bg-[#c9a96e]/8"
              : "border-white/8 bg-[#141414] hover:border-white/20"
          }`}
        >
          {pkg.featured && (
            <span className="absolute -top-2.5 left-4 text-[9px] tracking-[0.2em] uppercase bg-[#c9a96e] text-[#0a0a0a] px-2 py-0.5">
              Populer
            </span>
          )}
          <p className="font-serif text-base text-[#faf8f5] mb-0.5">{pkg.label}</p>
          <p className="text-lg font-medium text-[#c9a96e] mb-3">{pkg.priceLabel}</p>
          <div className="h-px bg-white/6 mb-3" />
          <p className="text-[10px] text-[#6a6a6a] leading-relaxed">
            {pkg.key === "basic" && "Template pilihan + fitur standar"}
            {pkg.key === "premium" && "Template premium + RSVP + kustomisasi"}
            {pkg.key === "exclusive" && "Fully custom + dedicated support"}
          </p>
          {value === pkg.key && (
            <div className="absolute top-4 right-4">
              <div className="w-4 h-4 rounded-full bg-[#c9a96e] flex items-center justify-center">
                <Check size={10} className="text-[#0a0a0a]" />
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Template Preview (if template param present) ───────────────────────────────

function TemplatePreview({ slug }: { slug: string | null }) {
  if (!slug) return null;
  const template = getTemplateBySlug(slug);
  if (!template) return null;

  return (
    <div className="flex items-center gap-3 p-3 border border-[#c9a96e]/20 bg-[#c9a96e]/5 mb-6">
      <div
        className="w-10 h-10 rounded border border-white/8 shrink-0"
        style={{
          background: `linear-gradient(135deg, ${template.gradientFrom} 0%, ${template.gradientTo} 100%)`,
        }}
      />
      <div>
        <p className="text-xs text-[#6a6a6a]">Template dipilih</p>
        <p className="text-sm text-[#faf8f5]">{template.name}</p>
      </div>
    </div>
  );
}

// ── Main Order Page ────────────────────────────────────────────────────────────

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateSlug = searchParams.get("template");
  const preSelectedPackage = searchParams.get("package");

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      packageKey: undefined,
      groomName: "",
      brideName: "",
      eventDate: "",
      phone: "",
      story: "",
      referralCode: "",
    },
  });

  // Pre-select package if ?package= is in the URL (from PricingSection)
  useEffect(() => {
    if (preSelectedPackage) {
      setSelectedPackage(preSelectedPackage);
      setValue("packageKey", preSelectedPackage as "basic", { shouldValidate: true });
      setStep(2);
    }
  }, [preSelectedPackage, setValue]);

  // Sync package selection with form value
  const handlePackageSelect = useCallback(
    (key: string) => {
      setSelectedPackage(key);
      setValue("packageKey", key as "basic", { shouldValidate: true });
    },
    [setValue]
  );

  // If package changes and we're on step 1, auto-advance to step 2
  useEffect(() => {
    if (selectedPackage && step === 1) {
      setStep(2);
    }
  }, [selectedPackage, step]);

  const watchedData = watch();
  const selectedPkg = PACKAGES.find((p) => p.key === watchedData.packageKey);

  const onSubmit = async (data: OrderFormData) => {
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug,
          packageKey: data.packageKey,
          groomName: data.groomName,
          brideName: data.brideName,
          eventDate: data.eventDate || null,
          phone: data.phone,
          story: data.story || null,
          referralCode: data.referralCode || null,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.error || "Gagal menyimpan pesanan");
        return;
      }

      // Store order code for reference (Phase 6: connect to user account)
      if (typeof window !== "undefined") {
        try {
          const existing = JSON.parse(localStorage.getItem("forvows_recent_orders") ?? "[]");
          const updated = [result.orderCode, ...existing].slice(0, 10);
          localStorage.setItem("forvows_recent_orders", JSON.stringify(updated));
        } catch {
          // ignore localStorage errors
        }
      }

      router.push(`/order-success?code=${encodeURIComponent(result.orderCode)}`);
    } catch {
      toast.error("Koneksi bermasalah. Silakan coba lagi.");
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#6a6a6a] hover:text-[#c9a96e] transition-colors"
          >
            <ArrowLeft size={12} />
            {templateSlug ? "Kembali ke Template" : "Lihat Template"}
          </Link>
        </div>

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] mb-3">
              Pesan Sekarang
            </p>
            <h1 className="font-serif text-3xl lg:text-4xl text-[#faf8f5] mb-3">
              {templateSlug ? "Pilih Paket untuk Template Ini" : "Buat Pesanan Anda"}
            </h1>
            <p className="text-sm text-[#8a8a8a]">
              {templateSlug
                ? "Pilih paket yang sesuai kebutuhan Anda, lengkapi data, dan selesaikan pembayaran."
                : "Pilih paket favorit Anda, lengkapi data couple, dan selesaikan pembayaran dengan Midtrans."}
            </p>
          </div>
        </ScrollReveal>

        <StepIndicator current={step} />

        {/* Template preview (if selected) */}
        {templateSlug && step === 2 && (
          <div className="mb-6">
            <TemplatePreview slug={templateSlug} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ── Step 1: Package Selection ──────────────────────── */}
          <div className={`space-y-5 ${step === 2 ? "opacity-40 pointer-events-none select-none" : ""}`}>
            <div>
              <label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a] mb-3 block">
                1. Pilih Paket <span className="text-[#c9a96e]">*</span>
              </label>
              <PackageSelector
                value={selectedPackage}
                onChange={handlePackageSelect}
              />
              {errors.packageKey && (
                <p className="text-[11px] text-red-400 mt-2">{errors.packageKey.message}</p>
              )}
            </div>
          </div>

          {/* ── Step 2: Customer Data ─────────────────────────── */}
          {step === 2 && (
            <div className="mt-8 space-y-5">
              {/* Package confirmation */}
              <div className="p-4 border border-[#c9a96e]/30 bg-[#c9a96e]/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-[#c9a96e]" />
                  <span className="text-xs text-[#8a8a8a]">Paket:</span>
                  <span className="text-sm text-[#faf8f5] font-medium">{selectedPkg?.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-serif text-[#c9a96e]">{selectedPkg?.priceLabel}</p>
                </div>
              </div>

              {/* Bride & Groom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="groomName" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                    Nama Mempelai Pria <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    id="groomName"
                    type="text"
                    {...register("groomName")}
                    placeholder="Nama lengkap pria"
                    className="w-full px-4 py-3 bg-[#141414] border text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                  {errors.groomName && (
                    <p className="text-[11px] text-red-400">{errors.groomName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="brideName" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                    Nama Mempelai Wanita <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    id="brideName"
                    type="text"
                    {...register("brideName")}
                    placeholder="Nama lengkap wanita"
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                  />
                  {errors.brideName && (
                    <p className="text-[11px] text-red-400">{errors.brideName.message}</p>
                  )}
                </div>
              </div>

              {/* Event Date */}
              <div className="space-y-1.5">
                <label htmlFor="eventDate" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  Tanggal Pernikahan
                </label>
                <div className="relative">
                  <input
                    id="eventDate"
                    type="date"
                    {...register("eventDate")}
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] focus:outline-none focus:border-[#c9a96e]/50 transition-colors [color-scheme:dark]"
                  />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a] pointer-events-none" />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  WhatsApp <span className="text-[#c9a96e]">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-400">{errors.phone.message}</p>
                )}
              </div>

              {/* Story */}
              <div className="space-y-1.5">
                <label htmlFor="story" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  Cerita Cinta / Catatan <span className="text-[#6a6a6a] font-normal">(opsional)</span>
                </label>
                <textarea
                  id="story"
                  {...register("story")}
                  placeholder="Ceritakan kisah cinta Anda atau tambahkan catatan untuk tim kami..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors resize-none"
                />
                {errors.story && (
                  <p className="text-[11px] text-red-400">{errors.story.message}</p>
                )}
              </div>

              {/* Referral Code */}
              <div className="space-y-1.5">
                <label htmlFor="referralCode" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
                  Kode Referral <span className="text-[#6a6a6a] font-normal">(opsional)</span>
                </label>
                <input
                  id="referralCode"
                  type="text"
                  {...register("referralCode")}
                  placeholder="Contoh: FORVLAUNCH"
                  className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-sm text-[#faf8f5] placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors uppercase"
                />
                {errors.referralCode && (
                  <p className="text-[11px] text-red-400">{errors.referralCode.message}</p>
                )}
                <p className="text-[10px] text-[#6a6a6a]">
                  Punya kode referral dari teman? Masukkan untuk dapat potongan harga.
                </p>
              </div>

              {/* Submit */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 flex items-center justify-center gap-2 bg-[#c9a96e] text-[#0a0a0a] text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-[#d4b87a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Pesan Sekarang
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-xs text-[#6a6a6a] hover:text-[#8a8a8a] transition-colors py-1"
                >
                  ← Ubah Paket
                </button>
              </div>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-6 pt-2">
                {[
                  "Pembayaran aman Midtrans",
                  "Data dienkripsi",
                  "Support via WhatsApp",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <Check size={10} className="text-[#c9a96e]" />
                    <span className="text-[10px] text-[#6a6a6a]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
