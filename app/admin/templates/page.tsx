"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Palette, Eye, Pencil, Star } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { templates } from "@/lib/templates";

const CATEGORIES = ["all", "luxury", "adat", "modern", "intimate"];
const CATEGORY_LABELS: Record<string, string> = {
  all: "Semua", luxury: "Luxury", adat: "Adat", modern: "Modern", intimate: "Intimate",
};

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editTemplate, setEditTemplate] = useState<string | null>(null);

  useEffect(() => {
    const { createClient } = require("@/lib/supabase/client");
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }: { data: { user: { email?: string } | null } }) => {
      if (!data.user) router.push("/admin/login");
      setUserEmail(data.user?.email ?? "");
    });
  }, [router]);

  const filtered = templates.filter(t => {
    const matchSearch = !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchCat = filter === "all" || t.category === filter;
    return matchSearch && matchCat;
  });

  const [localTemplates, setLocalTemplates] = useState(templates);

  const handleToggleFeatured = (slug: string) => {
    setLocalTemplates(prev =>
      prev.map(t => t.slug === slug ? { ...t, featured: !t.featured } : t)
    );
    // TODO: persist to Supabase
  };

  const handleToggleActive = (slug: string) => {
    // TODO: implement active/inactive toggle in Supabase
  };

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="admin" />
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-12 py-8 flex justify-between items-center border-b border-outline-variant/10">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-stitch-primary">Templates</h2>
            <p className="text-sm text-stone-500 mt-1 font-light">
              {localTemplates.length} template{localTemplates.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" strokeWidth={1.5} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
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
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs rounded-full border transition-all ${
                  filter === cat
                    ? "bg-stitch-primary text-white border-stitch-primary"
                    : "border-outline text-stitch-secondary hover:border-stitch-primary"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Template grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <Palette size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Tidak ada template.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(t => (
                <div key={t.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10">
                  {/* Preview card */}
                  <div
                    className="relative h-40"
                    style={{
                      background: `linear-gradient(135deg, ${t.gradientFrom} 0%, ${t.gradientTo} 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border opacity-20 rotate-45" style={{ borderColor: t.accentColor }} />
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
                        style={{ background: `${t.accentColor}30`, color: t.accentColor, border: `1px solid ${t.accentColor}40` }}
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
                          onClick={() => setEditTemplate(t.slug)}
                          className="p-2 rounded-lg border border-outline hover:bg-surface-container transition-colors text-outline hover:text-stitch-primary"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(t.slug)}
                          className={`p-2 rounded-lg border transition-colors ${
                            t.featured
                              ? "border-amber-400 text-amber-500 bg-amber-50"
                              : "border-outline text-outline hover:text-amber-500"
                          }`}
                          title={t.featured ? "Remove featured" : "Mark featured"}
                        >
                          <Star size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit modal placeholder */}
          {editTemplate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-lg shadow-2xl">
                <h3 className="font-headline text-xl text-stitch-primary mb-6">Edit Template</h3>
                <p className="text-sm text-stone-500">
                  Template "{editTemplate}" — edit form will connect to Supabase template management table.
                </p>
                <p className="text-xs text-stone-400 mt-2">
                  TODO: Add editable fields for name, description, price, category, featured status.
                </p>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setEditTemplate(null)}
                    className="px-6 py-2.5 bg-stitch-primary text-white rounded-xl text-sm font-semibold"
                  >
                    Tutup
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
