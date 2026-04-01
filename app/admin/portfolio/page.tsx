"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Image, Plus, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { createClient } from "@/lib/supabase/client";
import { portfolioItems } from "@/lib/templates";

const CATEGORIES = ["all", "luxury", "adat", "modern", "intimate"];
const CAT_LABELS: Record<string, string> = {
  all: "Semua", luxury: "Luxury", adat: "Adat", modern: "Modern", intimate: "Intimate",
};

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState(portfolioItems);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }: { data: { user: { email?: string } | null } }) => {
      if (!data.user) router.push("/admin/login");
      setUserEmail(data.user?.email ?? "");
    });
  }, [router]);

  const filtered = items.filter(i =>
    !search ||
    (i.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (i.description ?? "").toLowerCase().includes(search.toLowerCase())
  ).filter(i => filter === "all" || i.category === filter);

  const moveItem = (idx: number, dir: "up" | "down") => {
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= items.length) return;
    setItems(prev => {
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  };

  const toggleVisible = (id: string) => {
    // TODO: toggle in Supabase
  };

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="admin" />
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-12 py-8 flex justify-between items-center border-b border-outline-variant/10">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-stitch-primary">Portfolio</h2>
            <p className="text-sm text-stone-500 mt-1 font-light">
              {items.length} item{items.length !== 1 ? "s" : ""} · Kelola karya yang ditampilkan di halaman portfolio
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" strokeWidth={1.5} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari..."
                className="pl-11 pr-5 py-3 bg-surface-container-low rounded-xl w-64 text-sm border-none focus:ring-1 focus:ring-stitch-primary-container transition-all placeholder:text-stone-400"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-stitch-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={15} />
              Add Item
            </button>
            <span className="text-xs text-stone-500">{userEmail}</span>
          </div>
        </header>

        <section className="px-12 pb-24">
          {/* Category filter */}
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
                {CAT_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Portfolio list */}
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <Image size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Tidak ada item portfolio.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-6 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary w-16">Thumb</th>
                    <th className="px-6 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary">Item</th>
                    <th className="px-6 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary">Template</th>
                    <th className="px-6 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary">Kategori</th>
                    <th className="px-6 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filtered.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4">
                        <div
                          className="w-12 h-14 rounded-lg overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${item.gradientFrom} 0%, ${item.gradientTo} 100%)`,
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{item.description}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-stitch-secondary">{item.slug}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-surface-container text-stitch-secondary">
                          {CAT_LABELS[item.category] ?? item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => router.push(`/templates/${item.slug}`)} className="p-2 rounded-lg border border-outline hover:bg-surface-container transition-colors text-outline hover:text-stitch-primary" title="Preview">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => moveItem(idx, "up")} disabled={idx === 0} className="p-2 rounded-lg border border-outline hover:bg-surface-container transition-colors text-outline hover:text-stitch-primary disabled:opacity-30" title="Move up">
                            <ChevronUp size={14} />
                          </button>
                          <button onClick={() => moveItem(idx, "down")} disabled={idx === items.length - 1} className="p-2 rounded-lg border border-outline hover:bg-surface-container transition-colors text-outline hover:text-stitch-primary disabled:opacity-30" title="Move down">
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Add item modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="font-headline text-xl text-stitch-primary mb-6">Add Portfolio Item</h3>
              <div className="space-y-4 text-sm text-stone-500">
                <p>Form fields:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Couple Name</li>
                  <li>Template (dropdown from templates list)</li>
                  <li>Location</li>
                  <li>Wedding Date</li>
                  <li>Image Upload (Supabase Storage)</li>
                  <li>Category</li>
                </ul>
                <p className="text-xs text-stone-400 border-t border-outline pt-3">
                  TODO: Wire this form to Supabase portfolio table with image upload to Supabase Storage.
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-outline text-stitch-secondary text-sm">Batal</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-stitch-primary text-white rounded-xl text-sm font-semibold">Simpan</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
