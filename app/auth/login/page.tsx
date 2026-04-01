"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/context";

function CustomerLoginContent() {
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(
        lang === "id"
          ? "Email dan password wajib diisi."
          : "Email and password are required."
      );
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(
        lang === "id"
          ? "Email atau password salah."
          : "Invalid email or password."
      );
      setLoading(false);
      return;
    }

    router.push(redirectTo);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center px-6">
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
              {lang === "id" ? "Masuk ke Akun Anda" : "Sign In to Your Account"}
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
                ? "Masuk untuk melacak undangan Anda"
                : "Sign in to track your invitations"}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  required
                  autoComplete="email"
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
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

              {/* Error */}
              {error && (
                <div className="bg-stitch-error-container border border-stitch-error/20 text-stitch-on-error-container text-xs px-4 py-2.5 rounded-lg">
                  {error}
                </div>
              )}

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

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-outline-variant/20 flex-1" />
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-label">
                {lang === "id" ? "Atau" : "Or"}
              </span>
              <div className="h-px bg-outline-variant/20 flex-1" />
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={async () => {
                const supabase = createClient();
                let redirectTo = `${window.location.origin}/auth/callback`;
                // Append pending guest order codes so the callback can link them
                if (typeof window !== "undefined") {
                  try {
                    const stored = JSON.parse(
                      localStorage.getItem("forvows_recent_orders") ?? "[]"
                    ) as string[];
                    if (stored.length > 0) {
                      redirectTo += `?orders=${encodeURIComponent(JSON.stringify(stored))}`;
                    }
                  } catch { /* ignore */ }
                }
                await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo },
                });
              }}
              className="w-full py-3.5 mb-6 text-xs tracking-[0.15em] uppercase font-semibold text-stone-600 bg-white border border-outline-variant/30 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {lang === "id" ? "Lanjutkan dengan Google" : "Continue with Google"}
            </button>

            {/* Register link */}
            <div className="text-center mt-5 pt-5 border-t border-outline-variant/20">
              <p className="text-xs text-stone-400">
                {lang === "id"
                  ? "Belum punya akun?"
                  : "Don't have an account?"}{" "}
                <Link
                  href="/auth/register"
                  className="text-stitch-primary font-semibold hover:underline"
                >
                  {lang === "id" ? "Daftar di sini" : "Register here"}
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

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#d4af37]/30 border-t-[#735c00] rounded-full animate-spin" />
        </div>
      }
    >
      <CustomerLoginContent />
    </Suspense>
  );
}