"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  User,
  CreditCard,
  Headphones,
  Settings,
  LogOut,
  Plus,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Palette,
  Image,
  CalendarCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DashboardSidebarProps {
  variant?: "customer" | "admin";
}

export function DashboardSidebar({ variant = "customer" }: Readonly<DashboardSidebarProps>) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/dashboard" || path === "/admin/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    if (variant === "admin") {
      router.push("/admin/login");
    } else {
      router.push("/auth/login");
    }
  };

  const customerNav = [
    { tab: "orders",   label: "My Orders",  href: "/dashboard",         icon: BookOpen },
    { tab: "profile",  label: "Profile",    href: "/dashboard/profile", icon: User },
    { tab: "billing",  label: "Billing",    href: "/dashboard/billing", icon: CreditCard },
    { tab: "support",  label: "Support",    href: "/dashboard/support", icon: Headphones },
  ];

  const adminNav = [
    { tab: "dashboard", label: "Dashboard",  href: "/admin/dashboard", icon: LayoutDashboard },
    { tab: "orders",    label: "Pesanan",    href: "/admin/orders",    icon: ShoppingBag },
    { tab: "customers", label: "Customers",  href: "/admin/customers", icon: Users },
    { tab: "templates", label: "Templates",  href: "/admin/templates", icon: Palette },
    { tab: "portfolio", label: "Portfolio",  href: "/admin/portfolio", icon: Image },
    { tab: "rsvp",      label: "RSVP",       href: "/admin/rsvp",      icon: CalendarCheck },
    { tab: "settings",  label: "Settings",   href: "/admin/settings",  icon: Settings },
  ];

  const navItems = variant === "admin" ? adminNav : customerNav;

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 md:w-64 bg-surface-container-low flex flex-col z-40 py-6 md:py-8 pl-0 md:pl-6 border-r border-outline-variant/10 md:border-none">
      {/* Logo */}
      <div className="mb-8 md:mb-12 px-2 md:px-0 md:pr-6 flex justify-center md:justify-start">
        <Link href="/" className="block text-center md:text-left">
          <h1 className="font-serif italic text-lg md:text-xl text-[#735c00] md:mb-1 leading-none">
            <span className="md:hidden font-bold not-italic text-[#735c00]">FV</span>
            <span className="hidden md:inline">FOR Vows</span>
          </h1>
          <p className="hidden md:block text-[11px] uppercase tracking-widest text-stone-400 font-label">
            {variant === "admin" ? "Admin Portal" : "Digital Curator"}
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 md:space-y-1 w-full">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.tab}
              href={item.href}
              title={item.label}
              className={`
                flex items-center gap-4 py-3 md:py-3.5 px-0 md:px-5 justify-center md:justify-start
                md:rounded-l-[1.5rem] transition-all duration-200 w-full relative
                ${active 
                  ? "bg-white md:bg-white text-[#735c00] md:shadow-sm font-semibold md:-translate-x-1" 
                  : "text-stone-500 hover:text-[#735c00]"
                }
              `}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} className="shrink-0" />
              <span className="hidden md:inline text-[11px] uppercase tracking-widest font-label line-clamp-1">
                {item.label}
              </span>
              
              {/* Active indicator on mobile */}
              {active && (
                <div className="md:hidden absolute left-0 top-0 bottom-0 w-1 bg-[#735c00] rounded-r-md" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="md:pr-6 space-y-2 md:space-y-3 w-full">
        {variant === "customer" && (
          <div className="px-2 md:px-0">
            <Link
              href="/templates"
              title="New Invitation"
              className="flex items-center justify-center gap-2 w-full py-3 md:py-3.5 md:px-6 rounded-xl text-white text-xs font-medium shadow-[0_4px_12px_rgba(115,92,0,0.2)] hover:opacity-90 transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #735c00 0%, #d4af37 100%)",
              }}
            >
              <Plus size={14} strokeWidth={2.5} className="shrink-0" />
              <span className="hidden md:inline">New Invitation</span>
            </Link>
          </div>
        )}

        <button
          onClick={handleLogout}
          title="Log Out"
          className="flex items-center gap-4 py-3 md:py-3.5 px-0 md:px-5 justify-center md:justify-start text-stone-400 hover:text-red-500 transition-colors w-full"
        >
          <LogOut size={16} strokeWidth={1.5} className="shrink-0" />
          <span className="hidden md:inline text-[11px] uppercase tracking-widest font-label">
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
}
