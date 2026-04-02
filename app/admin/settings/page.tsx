"use client";

import { useEffect, useState } from"react";
import { useRouter } from"next/navigation";
import { Save, Phone, Eye, EyeOff, RefreshCw, KeyRound, CheckCircle2, AlertCircle, Loader2 } from"lucide-react";
import { toast } from"sonner";
import { DashboardSidebar } from"@/components/layout/DashboardSidebar";
import { createClient } from"@/lib/supabase/client";
import { PACKAGES } from"@/lib/packages";

export default function AdminSettingsPage() {
 const router = useRouter();
 const [userEmail, setUserEmail] = useState("");

 const [waNumber, setWaNumber] = useState("");
 const [email, setEmail] = useState("");
 const [instagram, setInstagram] = useState("");
 const [maintenanceMode, setMaintenanceMode] = useState(false);
 const [prices, setPrices] = useState({
 basic:"299000",
 premium:"599000",
 exclusive:"999000",
 });
 const [saving, setSaving] = useState(false);
 const [loaded, setLoaded] = useState(false);

 // Change password state
 const [oldPassword, setOldPassword] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [showOldPwd, setShowOldPwd] = useState(false);
 const [showNewPwd, setShowNewPwd] = useState(false);
 const [changingPassword, setChangingPassword] = useState(false);
 const [pwdSuccess, setPwdSuccess] = useState(false);
 const [pwdError, setPwdError] = useState<string | null>(null);

 useEffect(() => {
 const supabase = createClient();
 supabase.auth.getUser().then(({ data }: { data: { user: { email?: string } | null } }) => {
 if (!data.user) router.push("/admin/login");
 setUserEmail(data.user?.email ??"");
 });

 // Load settings from Supabase — TODO: create settings table in Supabase
 const loadSettings = async () => {
 try {
 const res = await fetch("/api/settings");
 if (res.ok) {
 const data = await res.json();
 if (data.settings) {
 setWaNumber(data.settings.wa_number ??"");
 setEmail(data.settings.email ??"");
 setInstagram(data.settings.instagram ??"");
 setMaintenanceMode(data.settings.maintenance_mode ?? false);
 if (data.settings.prices) setPrices(data.settings.prices);
 }
 }
 } catch {
 // Fallback jika tabel settings belum dibuat
 setWaNumber("");
 setEmail("");
 setInstagram("");
 }
 setLoaded(true);
 };
 loadSettings();
 }, [router]);

 const handleSave = async () => {
 setSaving(true);
 try {
 const res = await fetch("/api/settings", {
 method:"POST",
 headers: {"Content-Type":"application/json"},
 body: JSON.stringify({
 wa_number: waNumber,
 email,
 instagram,
 maintenance_mode: maintenanceMode,
 prices,
 }),
 });

 if (!res.ok) {
 const err = await res.json().catch(() => ({}));
 throw new Error(err.error ??"Gagal menyimpan");
 }

 toast.success("Pengaturan berhasil disimpan!");
 } catch (err) {
 const message = err instanceof Error ? err.message :"Gagal menyimpan pengaturan.";
 toast.error(message);
 } finally {
 setSaving(false);
 }
 };

 const handleChangePassword = async () => {
 setPwdError(null);
 setPwdSuccess(false);

 if (!oldPassword || !newPassword || !confirmPassword) {
 setPwdError("Semua field wajib diisi.");
 return;
 }
 if (newPassword.length < 6) {
 setPwdError("Password baru minimal 6 karakter.");
 return;
 }
 if (newPassword !== confirmPassword) {
 setPwdError("Konfirmasi password tidak cocok.");
 return;
 }

 setChangingPassword(true);
 const supabase = createClient();

 // Re-authenticate first to verify old password
 const { data: userData } = await supabase.auth.getUser();
 const currentEmail = userData.user?.email ??"";

 const { error: signInError } = await supabase.auth.signInWithPassword({
 email: currentEmail,
 password: oldPassword,
 });

 if (signInError) {
 setPwdError("Password lama salah.");
 setChangingPassword(false);
 return;
 }

 // Update password
 const { error: updateError } = await supabase.auth.updateUser({
 password: newPassword,
 });

 if (updateError) {
 setPwdError("Gagal mengubah password. Coba lagi.");
 } else {
 setPwdSuccess(true);
 setOldPassword("");
 setNewPassword("");
 setConfirmPassword("");
 toast.success("Password berhasil diubah!");
 }

 setChangingPassword(false);
 };

 const formatIDR = (v: string) =>
 new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", maximumFractionDigits: 0 }).format(Number(v));

 if (!loaded) {
 return (
 <div className="min-h-screen bg-surface">
 <DashboardSidebar variant="admin"/>
 <main className="ml-16 md:ml-64 min-h-screen flex items-center justify-center">
 <div className="w-8 h-8 border-2 border-stitch-primary-container/30 border-t-stitch-primary rounded-full animate-spin"/>
 </main>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-surface">
 <DashboardSidebar variant="admin"/>
 <main className="ml-16 md:ml-64 min-h-screen">
 <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-4 md:px-12 py-5 md:py-8 flex justify-between items-center border-b border-outline-variant/10">
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
 {saving ? <RefreshCw size={15} className="animate-spin"/> : <Save size={15} />}
 {saving ?"Menyimpan...":"Simpan Pengaturan"}
 </button>
 <span className="text-xs text-stone-500">{userEmail}</span>
 </div>
 </header>

 <section className="px-4 md:px-12 pb-24 space-y-8">
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
 Saat aktif, pengunjung akan melihat halaman &quot;Sedang dalam perawatan&quot; dan tidak bisa membuat pesanan.
 </p>
 </div>
 <button
 onClick={() => setMaintenanceMode(v => !v)}
 className={`relative w-14 h-8 rounded-full transition-colors ${
 maintenanceMode ?"bg-red-500":"bg-stitch-secondary/20"
 }`}
 >
 <span
 className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
 maintenanceMode ?"translate-x-7":"translate-x-1"
 }`}
 />
 </button>
 </div>
 </div>

 {/* Change Password */}
 <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
 <h3 className="font-headline text-lg text-stitch-primary mb-6 flex items-center gap-2">
 <KeyRound size={16} /> Ubah Password
 </h3>

 {pwdError && (
 <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl mb-5">
 <AlertCircle size={14} className="shrink-0 mt-0.5"/>
 <span>{pwdError}</span>
 </div>
 )}
 {pwdSuccess && (
 <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl mb-5">
 <CheckCircle2 size={14} className="shrink-0"/>
 <span>Password berhasil diubah!</span>
 </div>
 )}

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {/* Old Password */}
 <div>
 <label className="block text-[11px] uppercase tracking-widest font-label text-stitch-secondary mb-2">
 Password Lama
 </label>
 <div className="relative">
 <input
 type={showOldPwd ?"text":"password"}
 value={oldPassword}
 onChange={(e) => setOldPassword(e.target.value)}
 placeholder="••••••••"
 disabled={changingPassword}
 className="w-full px-4 py-3 pr-11 bg-surface-container-low rounded-xl text-sm border-none focus:ring-1 focus:ring-stitch-primary-container disabled:opacity-50"
 />
 <button
 type="button"
 onClick={() => setShowOldPwd((v) => !v)}
 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
 tabIndex={-1}
 >
 {showOldPwd ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
 </button>
 </div>
 </div>

 {/* New Password */}
 <div>
 <label className="block text-[11px] uppercase tracking-widest font-label text-stitch-secondary mb-2">
 Password Baru
 </label>
 <div className="relative">
 <input
 type={showNewPwd ?"text":"password"}
 value={newPassword}
 onChange={(e) => setNewPassword(e.target.value)}
 placeholder="Min 6 karakter"
 disabled={changingPassword}
 className="w-full px-4 py-3 pr-11 bg-surface-container-low rounded-xl text-sm border-none focus:ring-1 focus:ring-stitch-primary-container disabled:opacity-50"
 />
 <button
 type="button"
 onClick={() => setShowNewPwd((v) => !v)}
 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
 tabIndex={-1}
 >
 {showNewPwd ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
 </button>
 </div>
 </div>

 {/* Confirm Password */}
 <div>
 <label className="block text-[11px] uppercase tracking-widest font-label text-stitch-secondary mb-2">
 Konfirmasi Password Baru
 </label>
 <input
 type="password"
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 placeholder="Ulangi password baru"
 disabled={changingPassword}
 className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none focus:ring-1 focus:ring-stitch-primary-container disabled:opacity-50"
 />
 </div>
 </div>

 <div className="mt-5 flex justify-end">
 <button
 onClick={handleChangePassword}
 disabled={changingPassword || !oldPassword || !newPassword || !confirmPassword}
 className="flex items-center gap-2 px-6 py-3 text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
 style={{ background:"linear-gradient(135deg, #735c00 0%, #d4af37 100%)"}}
 >
 {changingPassword ? (
 <Loader2 size={15} className="animate-spin"/>
 ) : (
 <KeyRound size={15} />
 )}
 {changingPassword ?"Mengubah...":"Ubah Password"}
 </button>
 </div>
 </div>

 </section>
 </main>
 </div>
 );
}
