"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/context";
import type { OrderRow } from "@/types";

const STATUS_OPTIONS = [
  { value: "pending", label: "Menunggu" },
  { value: "waiting_payment", label: "Menunggu Bayar" },
  { value: "paid", label: "Sudah Bayar" },
  { value: "in_progress", label: "Sedang Dikerjakan" },
  { value: "revision", label: "Revisi" },
  { value: "completed", label: "Selesai" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  waiting_payment: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  paid: "bg-green-500/10 border-green-500/30 text-green-400",
  in_progress: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  revision: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  completed: "bg-[#c9a96e]/10 border-[#c9a96e]/30 text-[#c9a96e]",
};

export default function AdminDashboardPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Initial auth check + 30-minute session refresh interval
  useEffect(() => {
    const supabase = createClient();

    const checkSession = () => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          router.push("/admin/login");
        }
      });
    };

    // Check immediately on mount
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/admin/login");
        return;
      }
      setUserEmail(data.user.email ?? "");
    });

    fetchOrders();

    // Refresh session every 30 minutes
    const refreshInterval = setInterval(checkSession, 30 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const statusLabel = (status: string) => {
    return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const paidOrders = orders.filter((o) => ["paid", "in_progress", "revision", "completed"].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Admin Header */}
      <header className="bg-[#0f0f0f] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif italic text-xl text-[#c9a96e]">
            FOR Vows
          </Link>
          <span className="text-[#3a3a3a]">|</span>
          <span className="text-xs text-[#6a6a6a] tracking-wide">
            {lang === "id" ? "Admin Dashboard" : "Admin Dashboard"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#6a6a6a]">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-[#6a6a6a] hover:text-red-400 transition-colors tracking-wide"
          >
            {lang === "id" ? "Keluar" : "Logout"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-[#faf8f5]">
              {lang === "id" ? "Pesanan" : "Orders"}
            </h1>
            <p className="text-xs text-[#6a6a6a] mt-1">
              {lang === "id"
                ? `${totalOrders} pesanan total, ${pendingOrders} menunggu, ${paidOrders} aktif`
                : `${totalOrders} total orders, ${pendingOrders} pending, ${paidOrders} active`}
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6a6a6a] hidden sm:block">Filter:</span>
            <div className="flex gap-1 flex-wrap">
              {[{ value: "all", label: lang === "id" ? "Semua" : "All" }, ...STATUS_OPTIONS].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`px-3 py-1.5 text-[10px] tracking-wide border transition-colors ${
                    filter === opt.value
                      ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e]"
                      : "border-white/[0.07] bg-[#141414] text-[#6a6a6a] hover:border-white/[0.15]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#c9a96e]/20 border-t-[#c9a96e] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-white/[0.06] bg-[#0f0f0f]">
            <p className="text-[#6a6a6a] text-sm">
              {filter === "all"
                ? lang === "id"
                  ? "Belum ada pesanan."
                  : "No orders yet."
                : lang === "id"
                ? "Tidak ada pesanan dengan status ini."
                : "No orders with this status."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block border border-white/[0.06] overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-[#0f0f0f] border-b border-white/[0.06]">
                    {[
                      lang === "id" ? "Kode Pesanan" : "Order Code",
                      lang === "id" ? "Mempelai" : "Couple",
                      "Template",
                      lang === "id" ? "Paket" : "Package",
                      lang === "id" ? "Telepon" : "Phone",
                      lang === "id" ? "Tanggal" : "Date",
                      lang === "id" ? "Status" : "Status",
                      lang === "id" ? "Aksi" : "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-[10px] tracking-[0.12em] uppercase text-[#6a6a6a] font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="bg-[#0a0a0a] hover:bg-[#0f0f0f]/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-[#c9a96e] tracking-wider">
                          {order.order_code}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-[#faf8f5] leading-snug">
                          {order.groom_name}
                          <span className="text-[#6a6a6a] mx-1">&</span>
                          {order.bride_name}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-[#8a8a8a]">
                          {order.template ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-[#c9a96e] capitalize">
                          {order.package_name ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-[#8a8a8a]">{order.phone}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-[#6a6a6a] whitespace-nowrap">
                          {formatDate(order.created_at)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 border text-[10px] tracking-wider capitalize ${
                            STATUS_COLORS[order.status] ?? "border-white/[0.07] text-[#8a8a8a]"
                          }`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-[#141414] border border-white/[0.1] text-[#faf8f5] text-xs px-2 py-1.5 focus:outline-none focus:border-[#c9a96e]/50 transition-colors cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card grid */}
            <div className="md:hidden grid grid-cols-1 gap-3">
              {filtered.map((order) => (
                <div
                  key={order.id}
                  className="border border-white/[0.06] bg-[#0f0f0f] p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs text-[#c9a96e] tracking-wider">
                      {order.order_code}
                    </span>
                    <span
                      className={`shrink-0 px-2 py-0.5 border text-[10px] tracking-wider capitalize ${
                        STATUS_COLORS[order.status] ?? "border-white/[0.07] text-[#8a8a8a]"
                      }`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>
                  <div className="text-sm text-[#faf8f5]">
                    {order.groom_name}{" "}
                    <span className="text-[#6a6a6a]">&</span> {order.bride_name}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div>
                      <span className="text-[#6a6a6a]">Template: </span>
                      <span className="text-[#8a8a8a]">{order.template ?? "—"}</span>
                    </div>
                    <div>
                      <span className="text-[#6a6a6a]">Paket: </span>
                      <span className="text-[#c9a96e] capitalize">
                        {order.package_name ?? "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6a6a6a]">Telp: </span>
                      <span className="text-[#8a8a8a]">{order.phone}</span>
                    </div>
                    <div>
                      <span className="text-[#6a6a6a]">Tanggal: </span>
                      <span className="text-[#8a8a8a]">{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6a6a6a] uppercase tracking-wider">
                      {lang === "id" ? "Ubah Status" : "Change Status"}
                    </label>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="mt-1 w-full bg-[#141414] border border-white/[0.1] text-[#faf8f5] text-xs px-3 py-2 focus:outline-none focus:border-[#c9a96e]/50 transition-colors cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
