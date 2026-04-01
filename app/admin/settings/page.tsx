"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save, Phone, Mail, Instagram, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { PACKAGES } from "@/lib/packages";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  const [waNumber, setWaNumber] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [prices, setPrices] = useState({
    basic: "299000",
    premium: "599000",
    exclusive: "999000",
  });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const { createClient } = require("@/lib/supabase/client");
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }: { data: { user: { email?: string } | null } }) => {
      if (!data.user) router.push("/admin/login");
      setUserEmail(data.user?.email ?? "");
    });

    // Load settings from Supabase — TODO: create settings table in Supabase
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setWaNumber(data.settings.wa_number ?? "");
            setEmail(data.settings.email ?? "");
            setInstagram(data.settings.instagram ?? "");
            setMaintenanceMode(data.settings.maintenance_mode ?? false);
            if (data.settings.prices) setPrices(data.settings.prices);
          }
        }
      } catch {
        // Fallback: use env vars if API not ready
        setWaNumber(process.env.NEXT_PUBLIC_WA_NUMBER ?? "");
        setEmail("frameofrangga@gmail.com");
        setInstagram("frameofrangga");
      }
      setLoaded(true);
    };
    loadSettings();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: POST to /api/settings when that route is created
      // For now, save to localStorage as a temporary client-side persistence
      localStorage.setItem("forvows_admin_settings", JSON.stringify({ wa_number: waNumber, email, instagram, maintenance_mode: maintenanceMode, prices }));
      toast.success("Pengaturan berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  const formatIDR = (v: string) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(v));

  if (!loaded) {
    return (
      <div className="min-h-screen bg-surface">
        <DashboardSidebar variant="admin" />
        <main className="ml-64 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-stitch-primary-container/30 border-t-stitch-primary rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="admin" />
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-12 py-8 flex justify-between items-center border-b border-outline-variant/10">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-stitch-primary">Settings</h2>
            <p className="text-sm text-stone-500 mt-1 font-light">Kelola pengaturan website FOR Vows</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-stitch-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
            <span className="text-xs text-stone-500">{userEmail}</span>
          </div>
        </header>

        <section className="px-12 pb-24 space-y-8">
          {/* Contact Info */}
          <div className="mt-8 bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
            <h3 className="font-headline text-lg text-stitch-primary mb-6 flex items-center gap-2">
              <Phone size={16} /> Informasi Kontak
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-label text-stitch-secondary mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={waNumber}
                  onChange={e => setWaNumber(e.target.value)}
                  placeholder="6281234567890"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none focus:ring-1 focus:ring-stitch-primary-container"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-label text-stitch-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="hello@forvows.com"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none focus:ring-1 focus:ring-stitch-primary-container"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-label text-stitch-secondary mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="frameofrangga"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none focus:ring-1 focus:ring-stitch-primary-container"
                />
              </div>
            </div>
          </div>

          {/* Package Prices */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
            <h3 className="font-headline text-lg text-stitch-primary mb-6">Harga Paket</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PACKAGES.map(pkg => (
                <div key={pkg.key}>
                  <label className="block text-[11px] uppercase tracking-widest font-label text-stitch-secondary mb-2">
                    {pkg.label} (Rp)
                  </label>
                  <input
                    type="number"
                    value={prices[pkg.key]}
                    onChange={e => setPrices(prev => ({ ...prev, [pkg.key]: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none focus:ring-1 focus:ring-stitch-primary-container"
                  />
                  <p className="text-xs text-stone-400 mt-1">{formatIDR(prices[pkg.key])}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-4 border-t border-outline pt-4">
              TODO: Hubungkan ke tabel <code className="bg-surface-container px-1 py-0.5 rounded">settings</code> di Supabase. Perubahan harga akan mempengaruhi perhitungan order.
            </p>
          </div>

          {/* Maintenance Mode */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
            <h3 className="font-headline text-lg text-stitch-primary mb-4">Maintenance Mode</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-on-surface font-medium">Aktifkan Maintenance Mode</p>
                <p className="text-xs text-stone-400 mt-1">
                  Saat aktif, pengunjung akan melihat halaman "Sedang dalam perawatan" dan tidak bisa membuat pesanan.
                </p>
              </div>
              <button
                onClick={() => setMaintenanceMode(v => !v)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  maintenanceMode ? "bg-red-500" : "bg-stitch-secondary/20"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    maintenanceMode ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Database note */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <p className="text-sm font-semibold text-amber-700 mb-2">Pengaturan Belum Tersimpan di Database</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Untuk mengaktifkan penyimpanan pengaturan yang persisten, buat tabel <code>settings</code> di Supabase dengan kolom: <code>wa_number</code>, <code>email</code>, <code>instagram</code>, <code>maintenance_mode</code>, <code>prices</code> (JSONB). Lalu buat <code>app/api/settings/route.ts</code> dengan GET/POST endpoints.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
