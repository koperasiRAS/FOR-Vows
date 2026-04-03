"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Check,
  ChevronDown,
  Loader2,
  Send,
} from "lucide-react";

import {
  DIGITAL_INVITATION,
  WEDDING_PHOTOGRAPHY,
  CONTENT_CREATOR,
  SOUVENIR_DESIGN,
} from "@/lib/constants/services";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "undangan" | "foto" | "content" | "souvenir";

interface FormState {
  packageName: string;
  phone: string;
  notes: string;
  // Undangan
  groomName: string;
  brideName: string;
  akadDate: string;
  receptionDate: string;
  akadLocation: string;
  receptionLocation: string;
  email: string;
  // Foto & Content
  coupleName: string;
  weddingDate: string;
  venue: string;
  estimasiTamu: string;
  // Content-specific
  eventType: string;
  eventDate: string;
  eventLocation: string;
  igUsername: string;
  // Souvenir
  ordererName: string;
  productId: string;
  quantity: string;
  souvenirName: string;
  themeColor: string;
}

const EMPTY_FORM: FormState = {
  packageName: "",
  phone: "",
  notes: "",
  groomName: "",
  brideName: "",
  akadDate: "",
  receptionDate: "",
  akadLocation: "",
  receptionLocation: "",
  email: "",
  coupleName: "",
  weddingDate: "",
  venue: "",
  estimasiTamu: "",
  eventType: "",
  eventDate: "",
  eventLocation: "",
  igUsername: "",
  ordererName: "",
  productId: "",
  quantity: "",
  souvenirName: "",
  themeColor: "",
};

const CATEGORY_LABEL: Record<Category, string> = {
  undangan: "Undangan Digital",
  foto: "Foto & Video Wedding",
  content: "Content Creator",
  souvenir: "Souvenir",
};

const CATEGORY_DESC: Record<Category, string> = {
  undangan: "Undangan digital pernikahan modern & elegan",
  foto: "Abadikan momen pernikahanmu dengan profesional",
  content: "Konten pernikahanmu viral di media sosial",
  souvenir: "Souvenir pernikahan custom & berkesan",
};

const EVENT_TYPES = [
  "Akad Nikah",
  "Resepsi",
  "Siraman",
  "Engagement / Lamaran",
  "Pengajian",
  "Prewedding",
  "Sangjit",
  "Birthday",
  "Graduation",
  "Lainnya",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPackageOptions(category: Category): string[] {
  switch (category) {
    case "undangan":
      return DIGITAL_INVITATION.tiers.map((t) => t.label);
    case "foto":
      return WEDDING_PHOTOGRAPHY.tiers.map((t) => t.label);
    case "content":
      return CONTENT_CREATOR.tiers.map((t) => t.label);
    case "souvenir":
      return SOUVENIR_DESIGN.products.map((p) => p.name);
  }
}

function getSouvenirProductNames(): string[] {
  return SOUVENIR_DESIGN.products.map((p) => p.name);
}

// ─── Shared UI Components ─────────────────────────────────────────────────────

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] tracking-[0.12em] uppercase text-[#8a8a8a] font-medium mb-1.5"
    >
      {children}
      {required && <span className="text-[#c9a96e] ml-1">*</span>}
    </label>
  );
}

const inputBase =
  "w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#faf8f5] placeholder:text-[#3a3a3a] focus:outline-none focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/20 transition-all";
const inputError =
  "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
      <AlertCircle size={11} />
      {msg}
    </p>
  );
}

function InputField({
  id,
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputBase} ${error ? inputError : ""} ${
          type === "date" || type === "time" ? "[color-scheme:dark]" : ""
        }`}
      />
      <FieldError msg={error} />
    </div>
  );
}

function SelectField({
  id,
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} appearance-none pr-10 ${error ? inputError : ""}`}
        >
          <option value="" disabled>
            {placeholder ?? "Pilih..."}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#0f0f0f]">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6a6a6a] pointer-events-none"
        />
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function TextareaField({
  id,
  label,
  required,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${inputBase} resize-none ${error ? inputError : ""}`}
      />
      <FieldError msg={error} />
    </div>
  );
}

// ─── Category-specific field groups ──────────────────────────────────────────

function UndanganFields({
  form,
  errors,
  onChange,
}: {
  form: FormState;
  errors: Partial<Record<keyof FormState, string>>;
  onChange: (k: keyof FormState, v: string) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="groomName"
          label="Nama Pengantin Pria"
          required
          value={form.groomName}
          onChange={(v) => onChange("groomName", v)}
          placeholder="Nama lengkap"
          error={errors.groomName}
        />
        <InputField
          id="brideName"
          label="Nama Pengantin Wanita"
          required
          value={form.brideName}
          onChange={(v) => onChange("brideName", v)}
          placeholder="Nama lengkap"
          error={errors.brideName}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="akadDate"
          label="Tanggal Akad"
          required
          type="date"
          value={form.akadDate}
          onChange={(v) => onChange("akadDate", v)}
          error={errors.akadDate}
        />
        <InputField
          id="receptionDate"
          label="Tanggal Resepsi"
          type="date"
          value={form.receptionDate}
          onChange={(v) => onChange("receptionDate", v)}
        />
      </div>
      <InputField
        id="akadLocation"
        label="Lokasi Akad"
        required
        value={form.akadLocation}
        onChange={(v) => onChange("akadLocation", v)}
        placeholder="Nama gedung / masjid / rumah"
        error={errors.akadLocation}
      />
      <InputField
        id="receptionLocation"
        label="Lokasi Resepsi"
        value={form.receptionLocation}
        onChange={(v) => onChange("receptionLocation", v)}
        placeholder="Nama gedung (opsional)"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="phone"
          label="Nomor WhatsApp"
          required
          type="tel"
          value={form.phone}
          onChange={(v) => onChange("phone", v)}
          placeholder="08xxxxxxxxxx"
          error={errors.phone}
        />
        <InputField
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => onChange("email", v)}
          placeholder="email@contoh.com (opsional)"
          error={errors.email}
        />
      </div>
    </>
  );
}

function FotoFields({
  form,
  errors,
  onChange,
}: {
  form: FormState;
  errors: Partial<Record<keyof FormState, string>>;
  onChange: (k: keyof FormState, v: string) => void;
}) {
  return (
    <>
      <InputField
        id="coupleName"
        label="Nama Pasangan"
        required
        value={form.coupleName}
        onChange={(v) => onChange("coupleName", v)}
        placeholder="Contoh: Budi & Sari"
        error={errors.coupleName}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="weddingDate"
          label="Tanggal Pernikahan"
          required
          type="date"
          value={form.weddingDate}
          onChange={(v) => onChange("weddingDate", v)}
          error={errors.weddingDate}
        />
        <InputField
          id="estimasiTamu"
          label="Estimasi Jumlah Tamu"
          type="number"
          value={form.estimasiTamu}
          onChange={(v) => onChange("estimasiTamu", v)}
          placeholder="Contoh: 300 (opsional)"
        />
      </div>
      <InputField
        id="venue"
        label="Lokasi Venue"
        required
        value={form.venue}
        onChange={(v) => onChange("venue", v)}
        placeholder="Nama gedung / alamat"
        error={errors.venue}
      />
      <InputField
        id="phone"
        label="Nomor WhatsApp"
        required
        type="tel"
        value={form.phone}
        onChange={(v) => onChange("phone", v)}
        placeholder="08xxxxxxxxxx"
        error={errors.phone}
      />
    </>
  );
}

function ContentFields({
  form,
  errors,
  onChange,
}: {
  form: FormState;
  errors: Partial<Record<keyof FormState, string>>;
  onChange: (k: keyof FormState, v: string) => void;
}) {
  return (
    <>
      <InputField
        id="coupleName"
        label="Nama Pasangan"
        required
        value={form.coupleName}
        onChange={(v) => onChange("coupleName", v)}
        placeholder="Contoh: Aldo & Nina"
        error={errors.coupleName}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          id="eventType"
          label="Jenis Event"
          required
          value={form.eventType}
          onChange={(v) => onChange("eventType", v)}
          options={EVENT_TYPES}
          placeholder="Pilih jenis event"
          error={errors.eventType}
        />
        <InputField
          id="eventDate"
          label="Tanggal Event"
          required
          type="date"
          value={form.eventDate}
          onChange={(v) => onChange("eventDate", v)}
          error={errors.eventDate}
        />
      </div>
      <InputField
        id="eventLocation"
        label="Lokasi Event"
        required
        value={form.eventLocation}
        onChange={(v) => onChange("eventLocation", v)}
        placeholder="Nama gedung / rumah"
        error={errors.eventLocation}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="phone"
          label="Nomor WhatsApp"
          required
          type="tel"
          value={form.phone}
          onChange={(v) => onChange("phone", v)}
          placeholder="08xxxxxxxxxx"
          error={errors.phone}
        />
        <InputField
          id="igUsername"
          label="Username Instagram"
          value={form.igUsername}
          onChange={(v) => onChange("igUsername", v)}
          placeholder="@username (opsional)"
        />
      </div>
    </>
  );
}

function SouvenirFields({
  form,
  errors,
  onChange,
}: {
  form: FormState;
  errors: Partial<Record<keyof FormState, string>>;
  onChange: (k: keyof FormState, v: string) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="ordererName"
          label="Nama Pemesan"
          required
          value={form.ordererName}
          onChange={(v) => onChange("ordererName", v)}
          placeholder="Nama lengkap"
          error={errors.ordererName}
        />
        <InputField
          id="phone"
          label="Nomor WhatsApp"
          required
          type="tel"
          value={form.phone}
          onChange={(v) => onChange("phone", v)}
          placeholder="08xxxxxxxxxx"
          error={errors.phone}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          id="productId"
          label="Produk Souvenir"
          required
          value={form.productId}
          onChange={(v) => onChange("productId", v)}
          options={getSouvenirProductNames()}
          placeholder="Pilih produk"
          error={errors.productId}
        />
        <InputField
          id="quantity"
          label="Jumlah / Quantity"
          required
          type="number"
          value={form.quantity}
          onChange={(v) => onChange("quantity", v)}
          placeholder="Min. 100 pcs"
          error={errors.quantity}
        />
      </div>
      <InputField
        id="souvenirName"
        label="Nama yang Dicetak di Souvenir"
        required
        value={form.souvenirName}
        onChange={(v) => onChange("souvenirName", v)}
        placeholder="Contoh: Budi & Sari, 14 Februari 2025"
        error={errors.souvenirName}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="weddingDate"
          label="Tanggal Pernikahan"
          required
          type="date"
          value={form.weddingDate}
          onChange={(v) => onChange("weddingDate", v)}
          error={errors.weddingDate}
        />
        <InputField
          id="themeColor"
          label="Tema / Warna Preferensi"
          value={form.themeColor}
          onChange={(v) => onChange("themeColor", v)}
          placeholder="Contoh: Gold & Putih (opsional)"
        />
      </div>
    </>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(category: Category, form: FormState): Partial<Record<keyof FormState, string>> {
  const errs: Partial<Record<keyof FormState, string>> = {};
  const phone = form.phone.trim();

  if (!phone) errs.phone = "Nomor WhatsApp wajib diisi";
  else if (phone.length < 8) errs.phone = "Minimal 8 digit";
  else if (!/^[+\d\s\-()\b]+$/.test(phone)) errs.phone = "Format tidak valid";

  if (!form.packageName) errs.packageName = "Paket wajib dipilih";

  if (category === "undangan") {
    if (!form.groomName.trim()) errs.groomName = "Nama pengantin pria wajib diisi";
    if (!form.brideName.trim()) errs.brideName = "Nama pengantin wanita wajib diisi";
    if (!form.akadDate) errs.akadDate = "Tanggal akad wajib diisi";
    if (!form.akadLocation.trim()) errs.akadLocation = "Lokasi akad wajib diisi";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Format email tidak valid";
  }

  if (category === "foto") {
    if (!form.coupleName.trim()) errs.coupleName = "Nama pasangan wajib diisi";
    if (!form.weddingDate) errs.weddingDate = "Tanggal pernikahan wajib diisi";
    if (!form.venue.trim()) errs.venue = "Lokasi venue wajib diisi";
  }

  if (category === "content") {
    if (!form.coupleName.trim()) errs.coupleName = "Nama pasangan wajib diisi";
    if (!form.eventType) errs.eventType = "Jenis event wajib dipilih";
    if (!form.eventDate) errs.eventDate = "Tanggal event wajib diisi";
    if (!form.eventLocation.trim()) errs.eventLocation = "Lokasi event wajib diisi";
  }

  if (category === "souvenir") {
    if (!form.ordererName.trim()) errs.ordererName = "Nama pemesan wajib diisi";
    if (!form.productId) errs.productId = "Produk wajib dipilih";
    if (!form.quantity || Number(form.quantity) < 1) errs.quantity = "Jumlah wajib diisi";
    if (!form.souvenirName.trim()) errs.souvenirName = "Nama yang dicetak wajib diisi";
    if (!form.weddingDate) errs.weddingDate = "Tanggal pernikahan wajib diisi";
  }

  return errs;
}

// ─── Inner content (uses useSearchParams) ────────────────────────────────────

function OrderFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") as Category | null;
  const packageParam = searchParams.get("package") ?? "";
  const templateSlugParam = searchParams.get("template") ?? "";

  const validCategories: Category[] = ["undangan", "foto", "content", "souvenir"];
  const activeCategory: Category =
    categoryParam && validCategories.includes(categoryParam)
      ? categoryParam
      : "undangan";

  const [form, setForm] = useState<FormState>({
    ...EMPTY_FORM,
    packageName: packageParam,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Autofill package when URL param changes
  useEffect(() => {
    if (packageParam) {
      setForm((prev) => ({ ...prev, packageName: packageParam }));
    }
  }, [packageParam]);

  // Reset form (keep phone) when category tab changes
  useEffect(() => {
    setForm((prev) => ({ ...EMPTY_FORM, phone: prev.phone, packageName: "" }));
    setErrors({});
    setSubmitError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const handleChange = useCallback((key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const errs = validate(activeCategory, form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const base = {
        serviceCategory: activeCategory,
        packageName: form.packageName,
        phone: form.phone,
        notes: form.notes || undefined,
      };

      let payload: Record<string, unknown> = { ...base };

      if (activeCategory === "undangan") {
        payload = {
          ...payload,
          groomName: form.groomName,
          brideName: form.brideName,
          akadDate: form.akadDate,
          receptionDate: form.receptionDate || undefined,
          akadLocation: form.akadLocation,
          receptionLocation: form.receptionLocation || undefined,
          email: form.email || undefined,
          templateSlug: templateSlugParam || undefined,
        };
      } else if (activeCategory === "foto") {
        payload = {
          ...payload,
          coupleName: form.coupleName,
          weddingDate: form.weddingDate,
          venue: form.venue,
          estimasiTamu: form.estimasiTamu || undefined,
        };
      } else if (activeCategory === "content") {
        payload = {
          ...payload,
          coupleName: form.coupleName,
          eventType: form.eventType,
          eventDate: form.eventDate,
          eventLocation: form.eventLocation,
          igUsername: form.igUsername || undefined,
        };
      } else if (activeCategory === "souvenir") {
        payload = {
          ...payload,
          ordererName: form.ordererName,
          productId: form.productId,
          quantity: Number(form.quantity),
          souvenirName: form.souvenirName,
          weddingDate: form.weddingDate,
          themeColor: form.themeColor || undefined,
        };
      }

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setSubmitError(json.error ?? "Terjadi kesalahan. Silakan coba lagi.");
        return;
      }

      // Save to localStorage for reference
      try {
        const existing = JSON.parse(localStorage.getItem("forvows_recent_orders") ?? "[]");
        const updated = [json.orderCode, ...existing].slice(0, 10);
        localStorage.setItem("forvows_recent_orders", JSON.stringify(updated));
      } catch { /* ignore */ }

      router.push(`/order/summary?id=${encodeURIComponent(json.orderCode)}`);
    } catch {
      setSubmitError("Gagal menghubungi server. Periksa koneksi internet Anda.");
    } finally {
      setSubmitting(false);
    }
  }

  const packageOptions = getPackageOptions(activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,169,110,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#6a6a6a] hover:text-[#c9a96e] transition-colors mb-10 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Kembali
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#c9a96e] mb-3 font-medium">
            Form Pemesanan
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#faf8f5] leading-tight">
            {CATEGORY_LABEL[activeCategory]}
          </h1>
          <p className="text-[#6a6a6a] text-sm mt-2 leading-relaxed">
            {CATEGORY_DESC[activeCategory]}
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["undangan", "foto", "content", "souvenir"] as Category[]).map((cat) => (
            <Link
              key={cat}
              href={`/order?category=${cat}`}
              className={`px-4 py-2 rounded-full text-[11px] tracking-[0.1em] uppercase font-medium transition-all duration-200 ${
                cat === activeCategory
                  ? "bg-[#c9a96e] text-[#0a0a0a] shadow-[0_0_20px_rgba(201,169,110,0.25)]"
                  : "bg-white/5 text-[#6a6a6a] hover:bg-white/10 hover:text-[#8a8a8a]"
              }`}
            >
              {CATEGORY_LABEL[cat]}
            </Link>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-0">
          {/* Card: Paket */}
          <div className="bg-[#111111] border border-white/8 rounded-t-2xl px-6 sm:px-8 py-7 border-b-0">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] font-semibold mb-5">
              01 — Pilih Paket
            </p>
            <SelectField
              id="packageName"
              label="Paket yang Dipilih"
              required
              value={form.packageName}
              onChange={(v) => handleChange("packageName", v)}
              options={packageOptions}
              placeholder="Pilih paket layanan"
              error={errors.packageName}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 mx-6 sm:mx-8" />

          {/* Card: Detail */}
          <div className="bg-[#111111] border border-white/8 border-t-0 border-b-0 px-6 sm:px-8 py-7">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] font-semibold mb-5">
              02 — Detail Pesanan
            </p>
            <div className="flex flex-col gap-5">
              {activeCategory === "undangan" && (
                <UndanganFields form={form} errors={errors} onChange={handleChange} />
              )}
              {activeCategory === "foto" && (
                <FotoFields form={form} errors={errors} onChange={handleChange} />
              )}
              {activeCategory === "content" && (
                <ContentFields form={form} errors={errors} onChange={handleChange} />
              )}
              {activeCategory === "souvenir" && (
                <SouvenirFields form={form} errors={errors} onChange={handleChange} />
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 mx-6 sm:mx-8" />

          {/* Card: Catatan */}
          <div className="bg-[#111111] border border-white/8 border-t-0 border-b-0 px-6 sm:px-8 py-7">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] font-semibold mb-5">
              03 — Catatan Tambahan
            </p>
            <TextareaField
              id="notes"
              label="Catatan / Request Khusus"
              value={form.notes}
              onChange={(v) => handleChange("notes", v)}
              placeholder="Tuliskan request atau catatan khusus di sini (opsional)..."
              rows={4}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 mx-6 sm:mx-8" />

          {/* Card: Submit */}
          <div className="bg-[#111111] border border-white/8 rounded-b-2xl border-t-0 px-6 sm:px-8 py-7">
            {submitError && (
              <div className="mb-5 flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3.5">
                <AlertCircle size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-400 text-sm leading-relaxed">{submitError}</p>
              </div>
            )}

            <button
              id="submit-order"
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2.5 bg-[#c9a96e] hover:bg-[#d4b47a] active:scale-[0.99] disabled:bg-[#6a5a3a] disabled:cursor-not-allowed text-[#0a0a0a] font-semibold text-[11px] tracking-[0.2em] uppercase py-4 rounded-xl transition-all duration-200 shadow-[0_4px_24px_rgba(201,169,110,0.2)]"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Mengirim Pesanan...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Kirim Pesanan
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <p className="text-center text-[#4a4a4a] text-[11px] mt-4 leading-relaxed">
              Dengan mengirim form ini, kamu menyetujui bahwa tim FOR Vows akan menghubungi kamu via WhatsApp untuk konfirmasi.
            </p>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-5 pt-5 border-t border-white/5">
              {[
                { icon: "✓", label: "Respon 1×24 jam" },
                { icon: "✓", label: "Tanpa DP dulu" },
                { icon: "✓", label: "Revisi gratis" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-[#4a4a4a]">
                  <Check size={10} className="text-[#c9a96e]" />
                  <span className="text-[10px] tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

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
