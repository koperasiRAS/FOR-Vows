"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

function AdminLoginContent() {
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "unauthorized"
      ? lang === "id"
        ? "Akun ini tidak memiliki hak akses admin."
        : "This account does not have admin access."
      : null
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const result = await res.json();

    if (!result.success) {
      const msg = result.error ?? "";
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("credentials") ||
        msg.toLowerCase().includes("email") ||
        msg.toLowerCase().includes("password")
      ) {
        setError(lang === "id" ? "Email atau password salah." : "Invalid email or password.");
      } else if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("terlalu banyak")) {
        setError(
          lang === "id"
            ? "Terlalu banyak percobaan. Tunggu beberapa menit."
            : "Too many attempts. Please wait a few minutes."
        );
      } else {
        setError(
          lang === "id"
            ? "Login gagal. Coba lagi."
            : "Login failed. Please try again."
        );
      }
      setLoading(false);
      return;
    }

    // Auth succeeded — middleware will validate admin role and redirect
    router.push("/admin/orders");
    router.refresh();
  };

  const urlError = searchParams.get("error");

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center px-6">
      <div className="relative w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="font-serif italic text-4xl text-[#735c00] leading-none mb-2">
              FOR Vows
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-label">
              Admin Portal
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
              {lang === "id" ? "Selamat Datang" : "Welcome Back"}
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-light">
              {lang === "id"
                ? "Masuk untuk mengelola pesanan Anda"
                : "Sign in to manage your orders"}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error alert */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl">
                  <AlertCircle
                    size={14}
                    className="mt-0.5 shrink-0 text-red-500"
                    strokeWidth={2}
                  />
                  <span>{error}</span>
                </div>
              )}

              {urlError === "unauthorized" && !error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl">
                  <AlertCircle
                    size={14}
                    className="mt-0.5 shrink-0 text-red-500"
                    strokeWidth={2}
                  />
                  <span>
                    {lang === "id"
                      ? "Akun ini tidak memiliki hak akses admin."
                      : "This account does not have admin access."}
                  </span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="text-[11px] tracking-[0.12em] uppercase text-on-surface-variant font-label font-semibold"
                >
                  {lang === "id" ? "Email" : "Email"}
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@forvows.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant text-on-surface text-sm placeholder:text-stone-400 focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary/20 transition-colors rounded-lg font-label disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password"
                  className="text-[11px] tracking-[0.12em] uppercase text-on-surface-variant font-label font-semibold"
                >
                  {lang === "id" ? "Password" : "Password"}
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full px-4 py-3 pr-11 bg-surface-container-low border border-outline-variant text-on-surface text-sm placeholder:text-stone-400 focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary/20 transition-colors rounded-lg font-label disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-50"
                    tabIndex={-1}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={1.5} />
                    ) : (
                      <Eye size={16} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email.trim() || !password.trim()}
                className="w-full py-3.5 text-xs tracking-[0.15em] uppercase font-semibold text-white rounded-xl shadow-[0_8px_24px_rgba(115,92,0,0.25)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    {lang === "id" ? "Memuat..." : "Signing in..."}
                  </span>
                ) : lang === "id" ? (
                  "Masuk"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
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

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#d4af37]/30 border-t-[#735c00] rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
