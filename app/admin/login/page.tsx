"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/context";

function AdminLoginContent() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

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

    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <p className="font-serif italic text-3xl text-[#c9a96e] tracking-wide">
              FOR Vows
            </p>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#5a5a5a] mt-1">
              Admin Panel
            </p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f0f] border border-white/[0.07] p-8">
          <h1 className="font-serif text-xl text-[#faf8f5] mb-1.5 text-center">
            {lang === "id" ? "Masuk Admin" : "Admin Login"}
          </h1>
          <p className="text-xs text-[#6a6a6a] text-center mb-8">
            {lang === "id"
              ? "Masukkan kredensial admin Anda"
              : "Enter your admin credentials"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@forvows.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-[#faf8f5] text-sm placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full py-3.5 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading
                ? lang === "id"
                  ? "Memuat..."
                  : "Loading..."
                : lang === "id"
                ? "Masuk"
                : "Sign In"}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-[#5a5a5a] hover:text-[#8a8a8a] transition-colors"
          >
            ←{" "}
            {lang === "id" ? "Kembali ke Website" : "Back to Website"}
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
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#c9a96e]/20 border-t-[#c9a96e] rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
