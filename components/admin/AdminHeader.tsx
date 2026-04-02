"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";

interface AdminHeaderProps {
  userEmail: string;
  drawerOpen: boolean;
  onToggleDrawer: () => void;
}

function getInitials(email: string) {
  return email.split("@")[0].slice(0, 2).toUpperCase();
}

export function AdminHeader({
  userEmail,
  drawerOpen,
  onToggleDrawer,
}: AdminHeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-50 flex items-center justify-between
        h-14 px-4 bg-surface/95 backdrop-blur border-b border-outline-variant/10
      "
    >
      {/* Left slot */}
      {/* Mobile & Tablet: hamburger button */}
      <button
        onClick={onToggleDrawer}
        className="
          flex items-center justify-center p-2 rounded-lg
          hover:bg-surface-container-low transition-colors text-stitch-secondary
          lg:hidden
        "
        aria-label={drawerOpen ? "Close menu" : "Open menu"}
      >
        {drawerOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop: logo + badge + admin label (no hamburger) */}
      <div className="hidden lg:flex items-center gap-3">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="font-serif italic font-semibold text-sm text-[#735c00]">
            FOR Vows
          </span>
          <span className="text-[10px] text-stone-400 border rounded px-1.5 py-0.5 tracking-wide">
            Admin
          </span>
        </Link>
      </div>

      {/* Right slot: email + avatar only (logout is in sidebar) */}
      <div className="hidden lg:flex items-center gap-3">
        {userEmail && (
          <>
            <span
              className="text-xs text-stone-500 truncate max-w-[150px]"
              title={userEmail}
            >
              {userEmail}
            </span>
            <div className="w-8 h-8 rounded-full bg-stitch-secondary-fixed flex items-center justify-center text-[10px] font-bold text-stitch-on-secondary-container shrink-0">
              {getInitials(userEmail)}
            </div>
          </>
        )}
      </div>

      {/* Tablet & Mobile: logo centered */}
      <div className="flex lg:hidden items-center gap-3">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="font-serif italic font-semibold text-sm text-[#735c00]">
            FOR Vows
          </span>
          <span className="text-[10px] text-stone-400 border rounded px-1 py-0.5">Admin</span>
        </Link>
      </div>
    </header>
  );
}
