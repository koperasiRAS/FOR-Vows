"use client";

import { useEffect, useState } from"react";
import { useRouter } from"next/navigation";
import Link from"next/link";
import { ShoppingBag, TrendingUp, Clock, CheckCircle, Eye } from"lucide-react";
import { createClient } from"@/lib/supabase/client";

interface OrderRow {
 id: string;
 order_code: string;
 groom_name: string | null;
 bride_name: string | null;
 phone: string | null;
 package_name: string | null;
 status: string;
 final_total: number | null;
 created_at: string;
}

export default function AdminDashboardPage() {
 const router = useRouter();
 const [orders, setOrders] = useState<OrderRow[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const supabase = createClient();
 supabase.auth.getUser().then(({ data }: { data: { user: { email?: string } | null } }) => {
 if (!data.user) { router.push("/admin/login"); return; }
 });

 fetch("/api/orders")
 .then(r => r.json())
 .then(d => { setOrders(d.orders ?? []); setLoading(false); });
 }, [router]);

 const now = new Date();
 const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
 const monthOrders = orders.filter(o => new Date(o.created_at) >= startOfMonth);
 const monthRevenue = monthOrders
 .filter(o => ["paid","processing","completed"].includes(o.status))
 .reduce((s, o) => s + (o.final_total ?? 0), 0);
 const pendingCount = orders.filter(o => o.status ==="pending_payment").length;
 const processingCount = orders.filter(o => o.status ==="processing").length;
 const completedCount = orders.filter(o => o.status ==="completed").length;
 const recentOrders = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

 const formatIDR = (n: number) =>
 new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", maximumFractionDigits: 0 }).format(n);

 const formatDate = (d: string) =>
 new Intl.DateTimeFormat("id-ID", { day:"2-digit", month:"short"}).format(new Date(d));

 const statusColor = (s: string) => {
 if (s ==="completed") return"bg-green-100 text-green-700";
 if (s ==="processing") return"bg-blue-100 text-blue-700";
 if (s ==="pending_payment") return"bg-yellow-100 text-yellow-700";
 if (s ==="cancelled") return"bg-red-100 text-red-600";
 return"bg-stone-100 text-stone-600";
 };

 return (
 <div className="min-h-screen bg-surface">
 <main className="min-h-screen">
 <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-4 md:px-12 py-5 md:py-8 border-b border-outline-variant/10">
 <div className="flex justify-between items-center">
 <div>
 <h2 className="font-headline text-3xl font-bold tracking-tight text-stitch-primary">Dashboard</h2>
 <p className="text-sm text-stone-500 mt-1 font-light">
 {new Intl.DateTimeFormat("id-ID", { month:"long", year:"numeric"}).format(now)}
 </p>
 </div>
 </div>
 </header>

 <section className="px-4 md:px-12 pb-16">
 {loading ? (
 <div className="flex items-center justify-center py-32">
 <div className="w-8 h-8 border-2 border-stitch-primary-container/30 border-t-stitch-primary rounded-full animate-spin"/>
 </div>
 ) : (
 <>
 {/* Stat cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
 <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 flex flex-col justify-between min-h-[100px]">
 <div className="flex items-center gap-2 mb-2">
 <TrendingUp size={14} className="text-stitch-primary shrink-0"/>
 <span className="text-xs uppercase tracking-widest font-label text-stitch-secondary truncate">Revenue Bulan Ini</span>
 </div>
 <div>
 <span className="text-xl font-headline text-on-surface leading-tight">
 {monthRevenue > 0 ? formatIDR(monthRevenue) :"Rp 0"}
 </span>
 <p className="text-[10px] text-stone-400 mt-0.5">{monthOrders.length} pesanan</p>
 </div>
 </div>

 <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 flex flex-col justify-between min-h-[100px]">
 <div className="flex items-center gap-2 mb-2">
 <Clock size={14} className="text-yellow-600 shrink-0"/>
 <span className="text-xs uppercase tracking-widest font-label text-stitch-secondary">Menunggu</span>
 </div>
 <div>
 <span className="text-xl font-headline text-on-surface leading-tight">{pendingCount}</span>
 <p className="text-[10px] text-stone-400 mt-0.5">pesanan</p>
 </div>
 </div>

 <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 flex flex-col justify-between min-h-[100px]">
 <div className="flex items-center gap-2 mb-2">
 <ShoppingBag size={14} className="text-blue-600 shrink-0"/>
 <span className="text-xs uppercase tracking-widest font-label text-stitch-secondary truncate">Sedang Diproses</span>
 </div>
 <div>
 <span className="text-xl font-headline text-on-surface leading-tight">{processingCount}</span>
 <p className="text-[10px] text-stone-400 mt-0.5">pesanan</p>
 </div>
 </div>

 <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 flex flex-col justify-between min-h-[100px]">
 <div className="flex items-center gap-2 mb-2">
 <CheckCircle size={14} className="text-green-600 shrink-0"/>
 <span className="text-xs uppercase tracking-widest font-label text-stitch-secondary">Selesai</span>
 </div>
 <div>
 <span className="text-xl font-headline text-on-surface leading-tight">{completedCount}</span>
 <p className="text-[10px] text-stone-400 mt-0.5">pesanan</p>
 </div>
 </div>
 </div>

 {/* Recent orders */}
 <div className="mt-10 w-full">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-headline text-lg text-stitch-primary">Pesanan Terbaru</h3>
 <Link href="/admin/orders"className="text-xs text-stitch-primary hover:underline font-semibold">
 Lihat Semua →
 </Link>
 </div>

 <div className="bg-surface-container-lowest rounded-2xl overflow-x-auto border border-outline-variant/10">
 {recentOrders.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-14 text-stone-400 gap-2">
 <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-1">
 <ShoppingBag size={22} className="opacity-40"/>
 </div>
 <p className="text-sm font-medium">Belum ada pesanan.</p>
 <p className="text-xs text-stone-400">Pesanan baru akan muncul di sini.</p>
 </div>
 ) : (
 <table className="w-full text-left">
 <thead>
 <tr className="bg-surface-container-low">
 {["Order Code","Couple","Package","Status","Total","Date",""].map(h => (
 <th key={h} className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-stitch-secondary border-none">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-outline-variant/10">
 {recentOrders.map(o => (
 <tr key={o.id} className="hover:bg-surface-container-low/30 transition-colors">
 <td className="px-6 py-4 text-xs font-mono text-stitch-primary">{o.order_code}</td>
 <td className="px-6 py-4 text-xs text-on-surface">{o.groom_name} & {o.bride_name}</td>
 <td className="px-6 py-4 text-xs italic font-serif text-stitch-secondary">{o.package_name ??"—"}</td>
 <td className="px-6 py-4">
 <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${statusColor(o.status)}`}>
 {o.status}
 </span>
 </td>
 <td className="px-6 py-4 text-xs text-stitch-secondary">{formatIDR(o.final_total ?? 0)}</td>
 <td className="px-6 py-4 text-xs text-stone-400">{formatDate(o.created_at)}</td>
 <td className="px-6 py-4 text-right">
 <Link href={`/admin/orders/${o.id}`} className="text-stitch-primary hover:underline text-xs flex items-center gap-1 justify-end">
 <Eye size={12} /> Detail
 </Link>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </div>
 </>
 )}
 </section>
 </main>
 </div>
 );
}
