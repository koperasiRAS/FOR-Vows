"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Edit2, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/context";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { formatIDR } from "@/lib/utils";
import type { OrderRow } from "@/types";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "waiting_payment", label: "Waiting Payment" },
  { value: "paid", label: "Paid" },
  { value: "in_progress", label: "In Progress" },
  { value: "revision", label: "Revision" },
  { value: "completed", label: "Completed" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-stitch-error/10", text: "text-stitch-error", border: "border-stitch-error/20" },
  waiting_payment: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  paid: { bg: "bg-stone-100", text: "text-stone-500", border: "border-stone-200" },
  in_progress: { bg: "bg-stitch-primary-container/15", text: "text-stitch-primary", border: "border-stitch-primary-container/20" },
  revision: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  completed: { bg: "bg-stitch-primary-container/15", text: "text-stitch-primary", border: "border-stitch-primary-container/20" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-stitch-secondary-fixed",
    "bg-stitch-primary-fixed-dim",
    "bg-stitch-tertiary-fixed",
    "bg-stitch-error-container",
    "bg-stitch-primary-container/20",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function AdminOrdersPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/admin/login");
        return;
      }
      setUserEmail(data.user.email ?? "");
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) setOrders(data.orders ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // M3: Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const matchSearch =
      !search ||
      (o.groom_name?.toLowerCase()?.includes(search.toLowerCase()) ?? false) ||
      (o.bride_name?.toLowerCase()?.includes(search.toLowerCase()) ?? false) ||
      o.order_code.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as OrderRow["status"] } : o))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const statusLabel = (status: string) =>
    STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;

  const totalRevenue = orders
    .filter((o) => ["paid", "in_progress", "revision", "completed"].includes(o.status))
    .reduce((sum, o) => sum + (o.final_total ?? 0), 0);
  const activeCount = orders.filter((o) => ["in_progress", "revision"].includes(o.status)).length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar variant="admin" />

      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md px-12 py-8 flex justify-between items-center border-b border-outline-variant/10">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-stitch-primary">
              {lang === "id" ? "Semua Pesanan" : "All Orders"}
            </h2>
            <p className="text-sm text-stone-500 mt-1 font-light">
              {lang === "id"
                ? `${orders.length} total · ${pendingCount} menunggu`
                : `${orders.length} total · ${pendingCount} pending`}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" strokeWidth={1.5} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={lang === "id" ? "Cari nama..." : "Search customer..."}
                className="pl-11 pr-5 py-3 bg-surface-container-low rounded-xl w-72 text-sm border-none focus:ring-1 focus:ring-stitch-primary-container transition-all placeholder:text-stone-400"
              />
            </div>

            {/* Status filter */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setStatusOpen((v) => !v)}
                className="flex items-center gap-2 bg-surface-container-low px-4 py-3 rounded-xl cursor-pointer hover:bg-surface-container transition-colors border-none"
              >
                <Filter size={15} strokeWidth={1.5} className="text-outline" />
                <span className="text-sm font-medium text-stitch-secondary">
                  Status: {STATUS_OPTIONS.find((s) => s.value === filter)?.label}
                </span>
              </button>
              {statusOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-[0_20px_40px_rgba(43,43,43,0.08)] border border-outline-variant/20 overflow-hidden z-50 min-w-[160px]">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setFilter(opt.value); setPage(1); setStatusOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${
                        filter === opt.value ? "text-stitch-primary font-semibold" : "text-stitch-secondary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500">{userEmail}</span>
              <div className="w-10 h-10 rounded-full bg-stitch-secondary-fixed flex items-center justify-center text-xs font-bold text-stitch-on-secondary-container overflow-hidden">
                {userEmail ? getInitials(userEmail.split("@")[0]) : "AD"}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-stone-400 hover:text-stitch-error transition-colors ml-2"
              >
                {lang === "id" ? "Keluar" : "Logout"}
              </button>
            </div>
          </div>
        </header>

        <section className="px-12 pb-24">
          {/* Table */}
          <div className="mt-8 bg-surface-container-lowest rounded-[1rem] overflow-hidden shadow-[0_20px_40px_rgba(43,43,43,0.03)] border border-outline-variant/10">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-stitch-primary-container/30 border-t-stitch-primary rounded-full animate-spin" />
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <p className="text-sm">
                  {filter === "all"
                    ? lang === "id"
                      ? "Belum ada pesanan."
                      : "No orders yet."
                    : lang === "id"
                    ? "Tidak ada pesanan dengan filter ini."
                    : "No orders match this filter."}
                </p>
              </div>
            ) : (
              <>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low">
                      <th className="px-8 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary border-none">
                        Order ID
                      </th>
                      <th className="px-8 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary border-none">
                        Customer
                      </th>
                      <th className="px-8 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary border-none">
                        Date
                      </th>
                      <th className="px-8 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary border-none">
                        Package
                      </th>
                      <th className="px-8 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary border-none">
                        Status
                      </th>
                      <th className="px-8 py-5 font-label text-[11px] uppercase tracking-widest text-stitch-secondary border-none text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {paginated.map((order) => {
                      const style = STATUS_STYLE[order.status] ?? STATUS_STYLE.paid;
                      const initials = getInitials(`${order.groom_name} ${order.bride_name}`);
                      return (
                        <tr key={order.id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-8 py-6">
                            <span className="text-sm font-medium text-stitch-primary">{order.order_code}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${getAvatarColor(order.groom_name)} flex items-center justify-center text-[10px] font-bold`}>
                                {initials}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-on-surface">
                                  {order.groom_name} & {order.bride_name}
                                </p>
                                <p className="text-[11px] text-stone-400">{order.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm text-stitch-secondary">{formatDate(order.created_at)}</td>
                          <td className="px-8 py-6">
                            <span className="text-sm italic font-serif text-on-surface">
                              {order.package_name ?? "—"}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            {updatingId === order.id ? (
                              <span className="text-xs text-stone-400">Updating...</span>
                            ) : (
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border cursor-pointer focus:outline-none ${style.bg} ${style.text} ${style.border}`}
                              >
                                {STATUS_OPTIONS.filter((s) => s.value !== "all").map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-3">
                              <Link
                                href={`/admin/orders/${order.id}`}
                                className="p-2 rounded-full hover:bg-surface-container transition-colors text-outline hover:text-stitch-primary"
                                title="View"
                              >
                                <Eye size={18} strokeWidth={1.5} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-8 py-6 flex items-center justify-between bg-surface-container-low/30 border-t border-outline-variant/10">
                  <p className="text-xs text-stitch-secondary font-label uppercase tracking-widest">
                    {lang === "id"
                      ? `Menampilkan ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} dari ${filtered.length} pesanan`
                      : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} orders`}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-full hover:bg-surface-container transition-colors disabled:opacity-30 text-outline"
                    >
                      <ChevronLeft size={18} strokeWidth={1.5} />
                    </button>
                    <span className="text-sm font-medium text-stitch-primary">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-full hover:bg-surface-container transition-colors disabled:opacity-30 text-outline"
                    >
                      <ChevronRight size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bento Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-low p-8 rounded-[1rem] flex flex-col justify-between h-40">
              <span className="font-label text-[10px] uppercase tracking-widest text-stitch-secondary">
                {lang === "id" ? "Volume Bulanan" : "Monthly Volume"}
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-headline text-on-surface">
                  {totalRevenue > 0 ? formatIDR(totalRevenue) : "$0"}
                </span>
                <span className="text-xs text-stitch-primary font-bold">+{pendingCount}</span>
              </div>
            </div>

            <div className="bg-stitch-primary-container/10 p-8 rounded-[1rem] flex flex-col justify-between h-40 border border-stitch-primary-container/20">
              <span className="font-label text-[10px] uppercase tracking-widest text-stitch-primary">
                {lang === "id" ? "Desain Aktif" : "Active Designs"}
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-headline text-on-surface">{activeCount}</span>
                <TrendingUp size={18} strokeWidth={1.5} className="text-stitch-primary" />
              </div>
            </div>

            <div className="bg-surface-container p-8 rounded-[1rem] flex flex-col justify-between h-40">
              <span className="font-label text-[10px] uppercase tracking-widest text-stitch-secondary">
                {lang === "id" ? "Menunggu" : "Pending Review"}
              </span>
              <div className="flex items-end justify-between">
                <span className="text-lg font-headline italic text-on-surface-variant">{pendingCount} {lang === "id" ? "Tiket" : "Tickets"}</span>
                <button className="text-[10px] font-bold uppercase tracking-widest text-stitch-primary underline underline-offset-4">
                  {lang === "id" ? "Lihat" : "View"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}