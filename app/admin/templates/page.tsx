"use client";

import { useEffect, useState, useCallback } from"react";
import { useRouter } from"next/navigation";
import { Search, Palette, Eye, Pencil, Star, Save, X, Loader2, AlertCircle, CheckCircle2 } from"lucide-react";
import { DashboardSidebar } from"@/components/layout/DashboardSidebar";
import { createClient } from"@/lib/supabase/client";
import { templates as baseTemplates } from"@/lib/templates";

const CATEGORIES = ["all","luxury","adat","modern","intimate"];
const CATEGORY_LABELS: Record<string, string> = {
 all:"Semua", luxury:"Luxury", adat:"Adat", modern:"Modern", intimate:"Intimate",
};

interface TemplateOverride {
 slug: string;
 is_featured: boolean;
 price_override: string | null;
 display_name: string | null;
 display_description: string | null;
}

interface MergedTemplate {
 id: string;
 slug: string;
 name: string;
 shortDescription: string;
 category: string;
 featured: boolean;
 price: string;
 gradientFrom: string;
 gradientTo: string;
 accentColor: string;
}

function mergeWithOverrides(overrides: TemplateOverride[]): MergedTemplate[] {
 const overrideMap = new Map(overrides.map((o) => [o.slug, o]));
 return baseTemplates.map((t) => {
 const ov = overrideMap.get(t.slug);
 return {
 id: t.id,
 slug: t.slug,
 name: ov?.display_name ?? t.name,
 shortDescription: ov?.display_description ?? t.shortDescription,
 category: t.category,
 featured: ov !== undefined ? ov.is_featured : t.featured,
 price: ov?.price_override ?? t.price,
 gradientFrom: t.gradientFrom,
 gradientTo: t.gradientTo,
 accentColor: t.accentColor,
 };
 });
}

export default function AdminTemplatesPage() {
 const router = useRouter();
 const [userEmail, setUserEmail] = useState("");
 const [search, setSearch] = useState("");
 const [filter, setFilter] = useState("all");
 const [mergedTemplates, setMergedTemplates] = useState<MergedTemplate[]>(
 mergeWithOverrides([])
 );

 // Edit modal state
 const [editTemplate, setEditTemplate] = useState<MergedTemplate | null>(null);
 const [editForm, setEditForm] = useState({
 display_name:"",
 display_description:"",
 price_override:"",
 is_featured: false,
 });
 const [saving, setSaving] = useState(false);
 const [saveSuccess, setSaveSuccess] = useState(false);
 const [saveError, setSaveError] = useState<string | null>(null);

 // Per-card featured toggling
 const [togglingSlug, setTogglingSlug] = useState<string | null>(null);

 // ─── Load overrides from Supabase ────────────────────────────────────────────

 const loadOverrides = useCallback(async () => {
 const supabase = createClient();
 const { data, error } = await supabase
 .from("admin_template_overrides")
 .select("slug, is_featured, price_override, display_name, display_description");

 if (!error && data) {
 setMergedTemplates(mergeWithOverrides(data as TemplateOverride[]));
 }
 // If table doesn't exist yet, fallback silently to hardcoded data
 }, []);

 useEffect(() => {
 const supabase = createClient();
 supabase.auth.getUser().then(({ data }) => {
 if (!data.user) router.push("/admin/login");
 setUserEmail(data.user?.email ??"");
 });
 loadOverrides();
 }, [router, loadOverrides]);

 // ─── Filtered list ────────────────────────────────────────────────────────

 const filtered = mergedTemplates.filter((t) => {
 const matchSearch =
 !search ||
 t.name.toLowerCase().includes(search.toLowerCase()) ||
 t.shortDescription.toLowerCase().includes(search.toLowerCase());
 const matchCat = filter ==="all"|| t.category === filter;
 return matchSearch && matchCat;
 });

 // ─── Toggle featured ──────────────────────────────────────────────────────

 const handleToggleFeatured = async (slug: string) => {
 const template = mergedTemplates.find((t) => t.slug === slug);
 if (!template || togglingSlug) return;

 const newFeatured = !template.featured;
 setTogglingSlug(slug);

 // Optimistic update
 setMergedTemplates((prev) =>
 prev.map((t) => (t.slug === slug ? { ...t, featured: newFeatured } : t))
 );

 const supabase = createClient();
 const { error } = await supabase
 .from("admin_template_overrides")
 .upsert(
 {
 slug,
 is_featured: newFeatured,
 updated_at: new Date().toISOString(),
 },
 { onConflict:"slug"}
 );

 if (error) {
 // Revert on failure
 setMergedTemplates((prev) =>
 prev.map((t) => (t.slug === slug ? { ...t, featured: template.featured } : t))
 );
 console.error("Failed to toggle featured:", error);
 }

 setTogglingSlug(null);
 };

 // ─── Open edit modal ──────────────────────────────────────────────────────

 const openEditModal = (template: MergedTemplate) => {
 setEditTemplate(template);
 setSaveSuccess(false);
 setSaveError(null);
 setEditForm({
 display_name: template.name,
 display_description: template.shortDescription,
 price_override: template.price,
 is_featured: template.featured,
 });
 };

 // ─── Save edit ────────────────────────────────────────────────────────────

 const handleSaveEdit = async () => {
 if (!editTemplate) return;
 setSaving(true);
 setSaveError(null);
 setSaveSuccess(false);

 const supabase = createClient();
 const { error } = await supabase
 .from("admin_template_overrides")
 .upsert(
 {
 slug: editTemplate.slug,
 display_name: editForm.display_name.trim() || null,
 display_description: editForm.display_description.trim() || null,
 price_override: editForm.price_override.trim() || null,
 is_featured: editForm.is_featured,
 updated_at: new Date().toISOString(),
 },
 { onConflict:"slug"}
 );

 if (error) {
 setSaveError(
"Gagal menyimpan perubahan. Pastikan tabel admin_template_overrides sudah dibuat di Supabase."
 );
 setSaving(false);
 return;
 }

 // Update local state immediately
 setMergedTemplates((prev) =>
 prev.map((t) =>
 t.slug === editTemplate.slug
 ? {
 ...t,
 name: editForm.display_name.trim() || t.name,
 shortDescription: editForm.display_description.trim() || t.shortDescription,
 price: editForm.price_override.trim() || t.price,
 featured: editForm.is_featured,
 }
 : t
 )
 );

 setSaveSuccess(true);
 setSaving(false);
 setTimeout(() => {
 setEditTemplate(null);
 setSaveSuccess(false);
 }, 1000);
 };

 // ─── Render ───────────────────────────────────────────────────────────────

 return (
 <div className="min-h-screen bg-surface">
 <DashboardSidebar variant="admin"/>
 <main className="md:ml-64 min-h-screen">
 <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-12 py-8 flex justify-between items-center border-b border-outline-variant/10">
 <div>
 <h2 className="font-headline text-3xl font-bold tracking-tight text-stitch-primary">Templates</h2>
 <p className="text-sm text-stone-500 mt-1 font-light">
 {mergedTemplates.length} template{mergedTemplates.length !== 1 ?"s":""} total
 </p>
 </div>
 <div className="flex items-center gap-4">
 <div className="relative">
 <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"strokeWidth={1.5} />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Cari template..."
 className="pl-11 pr-5 py-3 bg-surface-container-low rounded-xl w-72 text-sm border-none focus:ring-1 focus:ring-stitch-primary-container transition-all placeholder:text-stone-400"
 />
 </div>
 <span className="text-xs text-stone-500">{userEmail}</span>
 </div>
 </header>

 <section className="px-12 pb-24">
 {/* Category filter pills */}
 <div className="flex flex-wrap gap-2 mt-8 mb-6">
 {CATEGORIES.map((cat) => (
 <button
 key={cat}
 onClick={() => setFilter(cat)}
 className={`px-4 py-2 text-xs rounded-full border transition-all ${
 filter === cat
 ?"bg-stitch-primary text-white border-stitch-primary"
 :"border-outline text-stitch-secondary hover:border-stitch-primary"
 }`}
 >
 {CATEGORY_LABELS[cat]}
 </button>
 ))}
 </div>

 {/* Template grid */}
 {filtered.length === 0 ? (
 <div className="text-center py-20 text-stone-400">
 <Palette size={32} className="mx-auto mb-3 opacity-40"/>
 <p className="text-sm">Tidak ada template.</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
 {filtered.map((t) => (
 <div
 key={t.id}
 className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10"
 >
 {/* Preview card */}
 <div
 className="relative h-40"
 style={{
 background: `linear-gradient(135deg, ${t.gradientFrom} 0%, ${t.gradientTo} 100%)`,
 }}
 >
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-12 h-12 border opacity-20 rotate-45"style={{ borderColor: t.accentColor }} />
 </div>
 {t.featured && (
 <div className="absolute top-3 right-3">
 <span className="text-[9px] uppercase tracking-widest bg-amber-400 text-black px-2 py-1 font-bold rounded-full flex items-center gap-1">
 <Star size={8} /> Featured
 </span>
 </div>
 )}
 <div className="absolute bottom-3 left-3">
 <span
 className="text-[9px] uppercase tracking-widest px-2 py-1 rounded-full font-bold"
 style={{
 background: `${t.accentColor}30`,
 color: t.accentColor,
 border: `1px solid ${t.accentColor}40`,
 }}
 >
 {CATEGORY_LABELS[t.category] ?? t.category}
 </span>
 </div>
 </div>

 {/* Info */}
 <div className="p-5 space-y-3">
 <div>
 <h3 className="font-headline text-lg text-on-surface">{t.name}</h3>
 <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{t.shortDescription}</p>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm font-semibold text-stitch-primary">{t.price}</span>
 <div className="flex gap-2">
 <button
 onClick={() => router.push(`/templates/${t.slug}`)}
 className="p-2 rounded-lg border border-outline hover:bg-surface-container transition-colors text-outline hover:text-stitch-primary"
 title="Preview"
 >
 <Eye size={15} />
 </button>
 <button
 onClick={() => openEditModal(t)}
 className="p-2 rounded-lg border border-outline hover:bg-surface-container transition-colors text-outline hover:text-stitch-primary"
 title="Edit"
 >
 <Pencil size={15} />
 </button>
 <button
 onClick={() => handleToggleFeatured(t.slug)}
 disabled={togglingSlug === t.slug}
 className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${
 t.featured
 ?"border-amber-400 text-amber-500 bg-amber-50"
 :"border-outline text-outline hover:text-amber-500 hover:border-amber-300"
 }`}
 title={t.featured ?"Hapus dari featured":"Tandai sebagai featured"}
 >
 {togglingSlug === t.slug ? (
 <Loader2 size={15} className="animate-spin"/>
 ) : (
 <Star size={15} />
 )}
 </button>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
 {editTemplate && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
 <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-outline-variant/10 mx-4 max-h-[90vh] overflow-y-auto">
 {/* Modal header */}
 <div className="flex items-start justify-between mb-6">
 <div>
 <h3 className="font-headline text-xl text-stitch-primary">Edit Template</h3>
 <p className="text-xs text-stone-400 mt-0.5">
 {editTemplate.slug}
 </p>
 </div>
 <button
 onClick={() => setEditTemplate(null)}
 className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
 >
 <X size={18} />
 </button>
 </div>

 {/* Error / Success banners */}
 {saveError && (
 <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl mb-5">
 <AlertCircle size={14} className="shrink-0 mt-0.5"/>
 <span>{saveError}</span>
 </div>
 )}
 {saveSuccess && (
 <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl mb-5">
 <CheckCircle2 size={14} className="shrink-0"/>
 <span>Perubahan berhasil disimpan!</span>
 </div>
 )}

 {/* Form fields */}
 <div className="space-y-5">
 {/* Nama */}
 <div className="space-y-1.5">
 <label className="text-[11px] tracking-[0.12em] uppercase text-stone-500 font-semibold">
 Nama Template
 </label>
 <input
 type="text"
 value={editForm.display_name}
 onChange={(e) =>
 setEditForm((prev) => ({ ...prev, display_name: e.target.value }))
 }
 className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 text-on-surface text-sm focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary/20 transition-colors rounded-lg"
 />
 </div>

 {/* Deskripsi singkat */}
 <div className="space-y-1.5">
 <label className="text-[11px] tracking-[0.12em] uppercase text-stone-500 font-semibold">
 Deskripsi Singkat
 </label>
 <textarea
 value={editForm.display_description}
 onChange={(e) =>
 setEditForm((prev) => ({ ...prev, display_description: e.target.value }))
 }
 rows={3}
 className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 text-on-surface text-sm focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary/20 transition-colors rounded-lg resize-none"
 />
 </div>

 {/* Harga */}
 <div className="space-y-1.5">
 <label className="text-[11px] tracking-[0.12em] uppercase text-stone-500 font-semibold">
 Harga (contoh: Rp 599.000)
 </label>
 <input
 type="text"
 value={editForm.price_override}
 onChange={(e) =>
 setEditForm((prev) => ({ ...prev, price_override: e.target.value }))
 }
 placeholder="Rp 599.000"
 className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 text-on-surface text-sm focus:outline-none focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary/20 transition-colors rounded-lg"
 />
 </div>

 {/* Featured toggle */}
 <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
 <input
 id="edit-featured"
 type="checkbox"
 checked={editForm.is_featured}
 onChange={(e) =>
 setEditForm((prev) => ({ ...prev, is_featured: e.target.checked }))
 }
 className="w-4 h-4 accent-amber-500 cursor-pointer"
 />
 <label htmlFor="edit-featured"className="text-sm text-amber-800 cursor-pointer">
 Tampilkan sebagai <strong>Featured</strong> di halaman template
 </label>
 </div>
 </div>

 {/* Actions */}
 <div className="flex gap-3 justify-end mt-7">
 <button
 onClick={() => setEditTemplate(null)}
 className="px-5 py-2.5 rounded-xl text-sm border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors"
 >
 Batal
 </button>
 <button
 onClick={handleSaveEdit}
 disabled={saving}
 className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 hover:opacity-90 disabled:opacity-60 transition-all"
 style={{
 background:"linear-gradient(135deg, #735c00 0%, #d4af37 100%)",
 }}
 >
 {saving ? (
 <Loader2 size={14} className="animate-spin"/>
 ) : saveSuccess ? (
 <CheckCircle2 size={14} />
 ) : (
 <Save size={14} />
 )}
 {saving ?"Menyimpan...": saveSuccess ?"Tersimpan!":"Simpan Perubahan"}
 </button>
 </div>
 </div>
 </div>
 )}
 </section>
 </main>
 </div>
 );
}
