"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  AlertCircle,
  KeyRound,
  X,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";

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

  // Reset password modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const result = await res.json();

      if (!result.success) {
        const msg: string = result.error ?? "";
        if (
          msg.toLowerCase().includes("admin") ||
          msg.toLowerCase().includes("hak akses")
        ) {
          setError(
            lang === "id"
              ? "Akun ini tidak memiliki hak akses admin."
              : "This account does not have admin access."
          );
        } else if (
          msg.toLowerCase().includes("terlalu banyak") ||
          msg.toLowerCase().includes("rate") ||
          msg.toLowerCase().includes("terkunci")
        ) {
          setError(
            lang === "id"
              ? "Terlalu banyak percobaan. Tunggu beberapa menit."
              : "Too many attempts. Please wait a few minutes."
          );
        } else {
          // Default: show email or password error
          setError(
            lang === "id"
              ? "Email atau password salah."
              : "Invalid email or password."
          );
        }
        setLoading(false);
        return;
      }
    } catch {
      setError(
        lang === "id"
          ? "Gagal terhubung. Periksa koneksi internet Anda."
          : "Connection failed. Check your internet connection."
      );
      setLoading(false);
      return;
    }

    // Auth succeeded — middleware will validate admin role and redirect
    router.push("/admin/orders");
    router.refresh();
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) return;
    setResetLoading(true);
    setResetError(null);

    try {
      const supabase = createClient();
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim(),
        {
          redirectTo: `${window.location.origin}/admin/settings?tab=password`,
        }
      );

      if (resetErr) {
        setResetError(
          lang === "id"
            ? "Gagal mengirim email reset. Pastikan email terdaftar."
            : "Failed to send reset email. Make sure the email is registered."
        );
      } else {
        setResetSent(true);
      }
    } catch {
      setResetError(lang === "id" ? "Terjadi kesalahan. Coba lagi." : "An error occurred. Try again.");
    }

    setResetLoading(false);
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

              {/* Reset password link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetSent(false);
                    setResetError(null);
                    setShowResetModal(true);
                  }}
                  className="text-xs text-stone-400 hover:text-[#735c00] transition-colors flex items-center gap-1.5 mx-auto"
                >
                  <KeyRound size={12} strokeWidth={1.5} />
                  {lang === "id" ? "Lupa / Ubah Password?" : "Forgot / Change Password?"}
                </button>
              </div>
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

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-outline-variant/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif italic text-xl text-[#735c00]">
                {lang === "id" ? "Reset Password" : "Reset Password"}
              </h3>
              <button
                onClick={() => setShowResetModal(false)}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {resetSent ? (
              <div className="text-center py-4">
                <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" strokeWidth={1.5} />
                <p className="text-sm font-medium text-on-surface mb-2">
                  {lang === "id" ? "Email terkirim!" : "Email sent!"}
                </p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {lang === "id"
                    ? `Link reset password telah dikirim ke ${resetEmail}. Cek inbox atau folder spam Anda.`
                    : `Password reset link sent to ${resetEmail}. Check your inbox or spam folder.`}
                </p>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="mt-6 w-full py-3 text-xs tracking-widest uppercase font-semibold text-white rounded-xl"
                  style={{ background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)" }}
                >
                  {lang === "id" ? "Tutup" : "Close"}
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-stone-500 mb-5 leading-relaxed">
                  {lang === "id"
                    ? "Masukkan email admin Anda. Kami akan mengirim link untuk mengubah password."
                    : "Enter your admin email. We'll send a link to reset your password."}
                </p>

                {resetError && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg mb-4">
                    <AlertCircle size={13} className="shrink-0 mt-0.5" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div className="space-y-1.5 mb-5">
                  <label className="text-[11px] tracking-[0.12em] uppercase text-stone-400 font-semibold">
                    Email Admin
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@forvows.com"
                    disabled={resetLoading}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-on-surface text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#735c00] focus:ring-1 focus:ring-[#735c00]/20 transition-colors rounded-lg disabled:opacity-50"
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  />
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={resetLoading || !resetEmail.trim()}
                  className="w-full py-3 text-xs tracking-widest uppercase font-semibold text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{ background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)" }}
                >
                  {resetLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  {resetLoading
                    ? (lang === "id" ? "Mengirim..." : "Sending...")
                    : (lang === "id" ? "Kirim Link Reset" : "Send Reset Link")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
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
