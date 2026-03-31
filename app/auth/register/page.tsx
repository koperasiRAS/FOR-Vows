"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/context";

function CustomerRegisterContent() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.password.trim()) {
      setError(lang === "id" ? "Semua kolom wajib diisi." : "All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(lang === "id" ? "Password tidak cocok." : "Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError(lang === "id" ? "Password minimal 6 karakter." : "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          phone: form.phone.trim(),
        },
      },
    });

    if (signUpError) {
      setError(
        signUpError.message.includes("already")
          ? lang === "id"
            ? "Email sudah terdaftar."
            : "Email is already registered."
          : lang === "id"
            ? "Terjadi kesalahan saat mendaftar. Silakan coba lagi."
            : "An error occurred during registration. Please try again."
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center px-6 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-surface" />

      <div className="relative w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="font-serif italic text-4xl text-[#735c00] leading-none mb-2">
              FOR Vows
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-label">
              {lang === "id" ? "Buat Akun Baru" : "Create Your Account"}
            </p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(43,43,43,0.08)] border border-outline-variant/20 overflow-hidden">
          {/* Card header */}
          <div className="bg-surface-container-low px-8 pt-8 pb-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#735c00] flex items-center justify-center mx-auto mb-4">
              <Lock size={18} className="text-white" strokeWidth={2} />
            </div>
            <h2 className="font-serif italic text-2xl text-on-surface">
              {lang === "id" ? "Pendaftaran" : "Create Account"}
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-light">
              {lang === "id"
                ? "Daftar untuk membuat undangan digital Anda"
                : "Register to create your digital wedding invitation"}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="text-[11px] tracking-[0.12em] uppercase text-on-surface-variant font-label font-semibold"
                >
                  {lang === "id" ? "Nama Lengkap" : "Full Name"}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder={lang === "id" ? "Rangga & Vina" : "John & Jane"}
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant text-on-surface text-sm placeholder:text-stone-400 focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary/20 transition-colors rounded-lg font-label"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-[11px] tracking-[0.12em] uppercase text-on-surface-variant font-label font-semibold"
                >
                  {lang === "id" ? "Email" : "Email"}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@contoh.com"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant text-on-surface text-sm placeholder:text-stone-400 focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary/20 transition-colors rounded-lg font-label"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="text-[11px] tracking-[0.12em] uppercase text-on-surface-variant font-label font-semibold"
                >
                  WhatsApp
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="081234567890"
                  required
                  autoComplete="tel"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant text-on-surface text-sm placeholder:text-stone-400 focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary/20 transition-colors rounded-lg font-label"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-[11px] tracking-[0.12em] uppercase text-on-surface-variant font-label font-semibold"
                >
                  {lang === "id" ? "Password" : "Password"}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-11 bg-surface-container-low border border-outline-variant text-on-surface text-sm placeholder:text-stone-400 focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary/20 transition-colors rounded-lg font-label"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={1.5} />
                    ) : (
                      <Eye size={16} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-[11px] tracking-[0.12em] uppercase text-on-surface-variant font-label font-semibold"
                >
                  {lang === "id" ? "Konfirmasi Password" : "Confirm Password"}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant text-on-surface text-sm placeholder:text-stone-400 focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary/20 transition-colors rounded-lg font-label"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-stitch-error-container border border-stitch-error/20 text-stitch-on-error-container text-xs px-4 py-2.5 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !form.fullName.trim() ||
                  !form.email.trim() ||
                  !form.phone.trim() ||
                  !form.password.trim() ||
                  !form.confirmPassword.trim()
                }
                className="w-full py-3.5 text-xs tracking-[0.15em] uppercase font-semibold text-white rounded-xl shadow-[0_8px_24px_rgba(115,92,0,0.25)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    {lang === "id" ? "Mendaftarkan..." : "Creating account..."}
                  </span>
                ) : lang === "id" ? (
                  "Daftar"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="text-center mt-5 pt-5 border-t border-outline-variant/20">
              <p className="text-xs text-stone-400">
                {lang === "id" ? "Sudah punya akun?" : "Already have an account?"}{" "}
                <Link
                  href="/auth/login"
                  className="text-stitch-primary font-semibold hover:underline"
                >
                  {lang === "id" ? "Masuk di sini" : "Sign in here"}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-[#735c00] transition-colors"
          >
            ← {lang === "id" ? "Kembali ke Website" : "Back to Website"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CustomerRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#d4af37]/30 border-t-[#735c00] rounded-full animate-spin" />
        </div>
      }
    >
      <CustomerRegisterContent />
    </Suspense>
  );
}