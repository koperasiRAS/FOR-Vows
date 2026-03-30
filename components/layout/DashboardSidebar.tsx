"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, User, CreditCard, Headphones, Settings, LogOut, Plus } from "lucide-react";
import { WA_NUMBER } from "@/lib/config";

interface DashboardSidebarProps {
  variant?: "customer" | "admin";
}

export function DashboardSidebar({ variant = "customer" }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard" || path === "/admin/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const customerNav = [
    {
      tab: "orders",
      label: "My Orders",
      href: "/dashboard",
      icon: BookOpen,
    },
    {
      tab: "profile",
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      tab: "billing",
      label: "Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      tab: "support",
      label: "Support",
      href: "/dashboard/support",
      icon: Headphones,
    },
  ];

  const adminNav = [
    {
      tab: "orders",
      label: "My Orders",
      href: "/dashboard",
      icon: BookOpen,
    },
    {
      tab: "profile",
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      tab: "billing",
      label: "Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      tab: "support",
      label: "Support",
      href: "/dashboard/support",
      icon: Headphones,
    },
    {
      tab: "admin",
      label: "Admin Panel",
      href: "/admin/dashboard",
      icon: Settings,
    },
  ];

  const navItems = variant === "admin" ? adminNav : customerNav;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#f6f3f2] flex flex-col z-40 py-8 pl-6">
      {/* Logo */}
      <div className="mb-12 pr-6">
        <Link href="/" className="block">
          <h1 className="font-serif italic text-xl text-[#735c00] mb-1 leading-none">
            FOR Vows
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-stone-400 font-label">
            The Digital Curator
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.tab}
              href={item.href}
              className={`
                flex items-center gap-4 py-3.5 px-5 rounded-l-[1.5rem] transition-all duration-200
                ${
                  active
                    ? "bg-white text-[#735c00] shadow-sm font-semibold -translate-x-1"
                    : "text-stone-500 hover:text-[#735c00] hover:-translate-x-0.5"
                }
              `}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[11px] uppercase tracking-widest font-label">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="pr-6 space-y-3">
        {/* New Invitation button */}
        <Link
          href="/templates"
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white text-xs font-medium shadow-[0_20px_40px_rgba(43,43,43,0.06)] hover:opacity-90 transition-all active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)",
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          New Invitation
        </Link>

        {/* Logout */}
        <Link
          href="/admin/login"
          className="flex items-center gap-4 py-3.5 px-5 text-stone-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span className="text-[11px] uppercase tracking-widest font-label">
            Log Out
          </span>
        </Link>
      </div>
    </aside>
  );
}