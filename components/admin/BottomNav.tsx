"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Palette,
  Image,
  CalendarCheck,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { tab: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { tab: "orders",    label: "Pesanan",   href: "/admin/orders",    icon: ShoppingBag },
  { tab: "customers", label: "Customers", href: "/admin/customers", icon: Users },
  { tab: "templates", label: "Templates",  href: "/admin/templates", icon: Palette },
  { tab: "portfolio", label: "Portfolio",  href: "/admin/portfolio", icon: Image },
  { tab: "rsvp",      label: "RSVP",       href: "/admin/rsvp",      icon: CalendarCheck },
  { tab: "settings", label: "Settings",  href: "/admin/settings",  icon: Settings },
];

function isActiveItem(href: string, pathname: string) {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        flex md:hidden
        bg-white border-t border-outline-variant/20
        items-center justify-around
      "
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActiveItem(item.href, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.tab}
            href={item.href}
            className={`
              flex-1 flex flex-col items-center justify-center
              py-2.5 gap-0.5 transition-colors
              ${active ? "text-[#8B6914]" : "text-stone-400"}
            `}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            <span
              className={`
                text-[10px] leading-none
                ${active ? "font-semibold" : "font-normal"}
              `}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
