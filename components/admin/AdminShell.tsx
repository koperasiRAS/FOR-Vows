"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Palette,
  Image,
  CalendarCheck,
  Settings,
  Users,
  X,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "./AdminHeader";
import { BottomNav } from "./BottomNav";

interface AdminShellProps {
  children: React.ReactNode;
}

const ADMIN_NAV = [
  { tab: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { tab: "orders",    label: "Pesanan",   href: "/admin/orders",    icon: ShoppingBag },
  { tab: "customers", label: "Customers", href: "/admin/customers", icon: Users },
  { tab: "templates", label: "Templates", href: "/admin/templates", icon: Palette },
  { tab: "portfolio", label: "Portfolio", href: "/admin/portfolio", icon: Image },
  { tab: "rsvp",      label: "RSVP",      href: "/admin/rsvp",      icon: CalendarCheck },
  { tab: "settings",  label: "Settings",  href: "/admin/settings",  icon: Settings },
];

function getInitials(email: string) {
  return email.split("@")[0].slice(0, 2).toUpperCase();
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/admin/login");
        return;
      }
      setUserEmail(data.user.email ?? "");
    });
  }, [router]);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [drawerOpen]);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-surface pb-16 lg:pb-0">
      {/* ===== DESKTOP SIDEBAR (lg+) ===== */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-16 xl:w-64 bg-surface-container-low z-40 py-6 xl:py-8 xl:pl-6 border-r border-outline-variant/10">
        {/* Logo */}
        <div className="mb-8 xl:mb-12 px-2 xl:px-0 flex justify-center xl:justify-start">
          <Link href="/admin/dashboard" className="block text-center xl:text-left">
            <h1 className="font-serif italic text-lg xl:text-xl text-[#735c00] xl:mb-1 leading-none">
              <span className="hidden xl:inline">FOR Vows</span>
              <span className="xl:hidden font-bold not-italic text-[#735c00]">FV</span>
            </h1>
            <p className="hidden xl:block text-[11px] uppercase tracking-widest text-stone-400 font-label">
              Admin Portal
            </p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 w-full">
          {ADMIN_NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.tab}
                href={item.href}
                title={item.label}
                className={`
                  flex items-center gap-4 py-3 xl:py-3.5 px-0 xl:px-5 justify-center xl:justify-start
                  xl:rounded-l-[1.5rem] transition-all duration-200 w-full relative
                  ${active
                    ? "bg-white xl:shadow-sm text-[#735c00] font-semibold xl:-translate-x-1"
                    : "text-stone-500 hover:text-[#735c00]"
                  }
                `}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.5} className="shrink-0" />
                <span className="hidden xl:inline text-[11px] uppercase tracking-widest font-label line-clamp-1">
                  {item.label}
                </span>
                {active && (
                  <div className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#735c00] rounded-r-md" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="xl:pr-6 w-full space-y-2 xl:space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 py-3 xl:py-3.5 px-0 xl:px-5 justify-center xl:justify-start text-stone-400 hover:text-red-500 transition-colors w-full"
          >
            <LogOut size={16} strokeWidth={1.5} className="shrink-0" />
            <span className="hidden xl:inline text-[11px] uppercase tracking-widest font-label">Log Out</span>
          </button>
        </div>
      </aside>

      {/* ===== TOP HEADER ===== */}
      <AdminHeader
        userEmail={userEmail}
        drawerOpen={drawerOpen}
        onToggleDrawer={() => setDrawerOpen((v) => !v)}
      />

      {/* ===== TABLET DRAWER OVERLAY ===== */}
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white z-50 flex flex-col py-6 pl-6
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between mb-8 pr-6">
          <Link href="/admin/dashboard" className="block">
            <h1 className="font-serif italic text-xl text-[#735c00] mb-0.5">FOR Vows</h1>
            <p className="text-[11px] uppercase tracking-widest text-stone-400 font-label">Admin Portal</p>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1 rounded hover:bg-surface-container-low text-stone-400 hover:text-stone-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 pr-6 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.tab}
                href={item.href}
                className={`
                  flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 w-full
                  ${active
                    ? "bg-[#735c00]/8 text-[#735c00] font-semibold"
                    : "text-stone-500 hover:text-[#735c00] hover:bg-stone-50"
                  }
                `}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.5} className="shrink-0" />
                <span className="text-[11px] uppercase tracking-widest font-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pr-6 space-y-2 pt-4 border-t border-outline-variant/10">
          {userEmail && (
            <div className="px-4 py-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-stitch-secondary-fixed flex items-center justify-center text-[10px] font-bold">
                {getInitials(userEmail)}
              </div>
              <span className="text-xs text-stone-500 truncate">{userEmail}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-3 px-4 w-full rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.5} />
            <span className="text-[11px] uppercase tracking-widest font-label">Log Out</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      {/* Desktop: offset for sidebar. Tablet/Mobile: full width (header handles spacing) */}
      <main className="lg:ml-16 xl:ml-64 min-h-screen">
        {children}
      </main>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <BottomNav />
    </div>
  );
}
