"use client";

import { useEffect, useState } from"react";
import { useRouter } from"next/navigation";
import { CalendarCheck, Download, Users, CheckCircle, XCircle, Clock } from"lucide-react";
import { DashboardSidebar } from"@/components/layout/DashboardSidebar";
import { createClient } from"@/lib/supabase/client";

export default function AdminRSVPPage() {
 const router = useRouter();
 const [userEmail, setUserEmail] = useState("");
 const [selectedOrder, setSelectedOrder] = useState("");
 const [orders, setOrders] = useState<{ id: string; order_code: string; groom_name: string | null; bride_name: string | null }[]>([]);
 const [rsvpData, setRsvpData] = useState<{
 guest_name: string;
 attending: boolean;
 guest_count: number;
 dietary?: string;
 message?: string;
 submitted_at: string;
 }[]>([]);
 const [loading, setLoading] = useState(false);

 useEffect(() => {
 const supabase = createClient();
 supabase.auth.getUser().then(({ data }: { data: { user: { email?: string } | null } }) => {
 if (!data.user) router.push("/admin/login");
 setUserEmail(data.user?.email ??"");
 });

 // Load orders to populate dropdown
 fetch("/api/orders").then(r => r.json()).then(d => {
 setOrders(d.orders ?? []);
 });
 }, [router]);

 const loadRSVP = async (orderCode: string) => {
 setLoading(true);
 // TODO: replace with a dedicated /api/rsvp endpoint when that table is created
 // For now, show a placeholder based on order_code
 setRsvpData([
 { guest_name:"Placeholder — Connect to RSVP table", attending: true, guest_count: 2, message:"Hadir dengan senang hati!", submitted_at: new Date().toISOString() },
 { guest_name:"Placeholder — RSVP data not yet implemented", attending: false, guest_count: 0, submitted_at: new Date().toISOString() },
 ]);
 setLoading(false);
 };

 const total = rsvpData.length;
 const confirmed = rsvpData.filter(r => r.attending).length;
 const declined = rsvpData.filter(r => !r.attending).length;
 const guestCount = rsvpData.filter(r => r.attending).reduce((s, r) => s + (r.guest_count ?? 0), 0);

 const exportCSV = () => {
 if (!rsvpData.length) return;
 const headers = ["Guest Name","Attending","Guest Count","Dietary","Message","Submitted At"];
 const rows = rsvpData.map(r => [
 r.guest_name, r.attending ?"Yes":"No", r.guest_count, r.dietary ??"", r.message ??"", r.submitted_at,
 ]);
 const csv = [headers.join(","), ...rows.map(row => row.map(v => `"${v}"`).join(","))].join("\n");
 const blob = new Blob([csv], { type:"text/csv"});
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `FOR_Vows_RSVP_${selectedOrder}_${new Date().toISOString().split("T")[0]}.csv`;
 a.click();
 };

 const fmtDate = (d: string) =>
 new Intl.DateTimeFormat("id-ID", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit"}).format(new Date(d));

 return (
 <div className="min-h-screen bg-surface">
 <DashboardSidebar variant="admin"/>
 <main className="md:ml-64 min-h-screen">
 <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-12 py-8 flex justify-between items-center border-b border-outline-variant/10">
 <div>
 <h2 className="font-headline text-3xl font-bold tracking-tight text-stitch-primary">RSVP</h2>
 <p className="text-sm text-stone-500 mt-1 font-light">Lihat dan export data RSVP tamu</p>
 </div>
 <div className="flex items-center gap-4">
 <select
 value={selectedOrder}
 onChange={e => { setSelectedOrder(e.target.value); loadRSVP(e.target.value); }}
 className="px-4 py-3 bg-surface-container-low rounded-xl text-sm border-none focus:ring-1 focus:ring-stitch-primary-container"
 >
 <option value="">Pilih Pesanan...</option>
 {orders.map(o => (
 <option key={o.id} value={o.order_code}>
 {o.order_code} — {o.groom_name} & {o.bride_name}
 </option>
 ))}
 </select>
 <button
 onClick={exportCSV}
 disabled={!rsvpData.length}
 className="flex items-center gap-2 px-4 py-3 bg-stitch-primary text-white rounded-xl disabled:opacity-40 text-sm font-semibold hover:opacity-90 transition-opacity"
 >
 <Download size={15} /> Export CSV
 </button>
 <span className="text-xs text-stone-500">{userEmail}</span>
 </div>
 </header>

 <section className="px-12 pb-24">
 {/* Stats */}
 {selectedOrder && (
 <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
 {[
 { label:"Total Diundang", value: total, icon: Users, color:"text-stitch-secondary"},
 { label:"Hadir", value: confirmed, icon: CheckCircle, color:"text-green-600"},
 { label:"Maaf", value: declined, icon: XCircle, color:"text-red-500"},
 { label:"Total Tamu", value: guestCount, icon: CalendarCheck, color:"text-stitch-primary"},
 ].map(stat => (
 <div key={stat.label} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
 <div className="flex items-center gap-2 mb-2">
 <stat.icon size={14} className={stat.color} />
 <span className="text-[10px] uppercase tracking-widest text-stitch-secondary font-label">{stat.label}</span>
 </div>
 <span className="text-2xl font-headline text-on-surface">{stat.value}</span>
 </div>
 ))}
 </div>
 )}

 {/* Table */}
 <div className="mt-8 bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10">
 {loading ? (
 <div className="flex items-center justify-center py-20">
 <div className="w-8 h-8 border-2 border-stitch-primary-container/30 border-t-stitch-primary rounded-full animate-spin"/>
 </div>
 ) : !selectedOrder ? (
 <div className="text-center py-20 text-stone-400">
 <Clock size={32} className="mx-auto mb-3 opacity-40"/>
 <p className="text-sm">Pilih pesanan di atas untuk melihat data RSVP.</p>
 </div>
 ) : rsvpData.length === 0 ? (
 <div className="text-center py-20 text-stone-400">
 <CalendarCheck size={32} className="mx-auto mb-3 opacity-40"/>
 <p className="text-sm">Belum ada data RSVP untuk pesanan ini.</p>
 </div>
 ) : (
 <table className="w-full text-left">
 <thead>
 <tr className="bg-surface-container-low">
 {["Nama Tamu","Status","Jumlah Tamu","Pesan","Waktu"].map(h => (
 <th key={h} className="px-8 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary border-none">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-outline-variant/10">
 {rsvpData.map((r, i) => (
 <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
 <td className="px-8 py-5 text-sm font-medium text-on-surface">{r.guest_name}</td>
 <td className="px-8 py-5">
 <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
 r.attending ?"bg-green-100 text-green-700":"bg-red-100 text-red-600"
 }`}>
 {r.attending ?"Hadir":"Maaf"}
 </span>
 </td>
 <td className="px-8 py-5 text-sm text-stitch-secondary">{r.guest_count}</td>
 <td className="px-8 py-5 text-xs text-stone-400 italic max-w-xs truncate">{r.message ??"—"}</td>
 <td className="px-8 py-5 text-xs text-stone-400">{fmtDate(r.submitted_at)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </section>
 </main>
 </div>
 );
}
