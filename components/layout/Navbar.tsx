"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

// ─── Nav Data Types ─────────────────────────────────────────────────────────

type NavItem =
  | { type: "link"; href: string; labelKey: string }
  | { type: "dropdown"; labelKey: string; items: { href: string; labelKey: string }[] };

const NAV_ITEMS: NavItem[] = [
  {
    type: "dropdown",
    labelKey: "nav.layanan",
    items: [
      { href: "/pricing#undangan-digital",   labelKey: "nav.layanan.digital"       },
      { href: "/pricing#foto-video",         labelKey: "nav.layanan.fotoVideo"      },
      { href: "/pricing#content-creator",  labelKey: "nav.layanan.contentCreator" },
      { href: "/pricing#souvenir",          labelKey: "nav.layanan.souvenir"        },
      { href: "/pricing#website",          labelKey: "nav.layanan.website"         },
    ],
  },
  {
    type: "dropdown",
    labelKey: "nav.harga",
    items: [
      { href: "/pricing#undangan-digital", labelKey: "nav.hargaDropdown.digital"      },
      { href: "/pricing#foto-video",       labelKey: "nav.hargaDropdown.fotoVideo"     },
      { href: "/pricing#content-creator", labelKey: "nav.hargaDropdown.contentCreator" },
      { href: "/pricing#souvenir",      labelKey: "nav.hargaDropdown.souvenir"       },
    ],
  },
  { type: "link", href: "/portfolio", labelKey: "nav.portfolio" },
  { type: "link", href: "/how-it-works", labelKey: "nav.caraPesan" },
  { type: "link", href: "/about", labelKey: "nav.tentang" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function DropdownMenu({
  items,
  open,
  onClose,
}: {
  items: { href: string; labelKey: string }[];
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
      aria-hidden={!open}
    >
      <div className="w-3 h-3 bg-[#1a1a1a] border-l border-t border-white/10 rotate-45 mx-auto -mt-[7px]" />

      <div
        className={`
          bg-[#1a1a1a] border border-white/10 rounded-xl
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          overflow-hidden
          transition-all duration-300 ease-out
          ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        `}
        style={{ minWidth: "220px" }}
      >
        <div className="py-2">
          {items.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                block px-5 py-2.5 text-sm text-[#9a9a9a]
                hover:text-[#c9a96e] hover:bg-white/4
                transition-colors duration-200 cursor-pointer
                ${i < items.length - 1 ? "border-b border-white/5" : ""}
              `}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileAccordionDropdown({
  items,
  labelKey,
  open,
  onToggle,
}: {
  items: { href: string; labelKey: string }[];
  labelKey: string;
  open: boolean;
  onToggle: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="border-b border-white/[0.06] pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-base tracking-wide text-[#9a9a9a] hover:text-[#c9a96e] transition-colors py-1"
      >
        {t(labelKey)}
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-out
          ${open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}
        `}
      >
        <div className="pl-4 flex flex-col gap-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-stone-500 hover:text-[#c9a96e] transition-colors py-0.5"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const { itemCount, setOpen } = useCart();
  const { t } = useLanguage();

  // Click-outside to close dropdown
  const dropdownRefs = useRef<Map<string, HTMLElement>>(new Map());

  const isHiddenPage =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/demo") ||
    pathname?.startsWith("/t/") ||
    pathname === "/t";

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!openDropdown) return;

    const handleClick = (e: MouseEvent) => {
      const ref = dropdownRefs.current.get(openDropdown);
      if (ref && !ref.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileAccordion(null);
  }, [pathname]);

  const toggleDropdown = (labelKey: string) => {
    setOpenDropdown((prev) => (prev === labelKey ? null : labelKey));
  };

  const toggleAccordion = (labelKey: string) => {
    setMobileAccordion((prev) => (prev === labelKey ? null : labelKey));
  };

  if (isHiddenPage) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 lg:h-[72px] flex items-center justify-between gap-4">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative h-16 w-auto sm:h-24">
            <Image
              src="/images/logo-brand.png"
              alt="FOR Vows"
              width={400}
              height={100}
              className="h-full w-auto object-contain group-hover:opacity-80 transition-opacity"
              priority
            />
          </div>
        </Link>

        {/* ── Desktop Nav (Center) ── */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            if (item.type === "link") {
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-sm tracking-wide text-[#9a9a9a] hover:text-[#c9a96e] transition-colors duration-300 relative group"
                  >
                    {t(item.labelKey)}
                    <span className="absolute -bottom-0.5 left-4 right-4 h-px bg-[#c9a96e] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </li>
              );
            }

            const dropdownKey = item.labelKey;
            const isOpen = openDropdown === dropdownKey;

            return (
              <li
                key={dropdownKey}
                className="relative"
                ref={(el) => {
                  if (el) dropdownRefs.current.set(dropdownKey, el);
                }}
              >
                <button
                  onClick={() => toggleDropdown(dropdownKey)}
                  className={`
                    px-4 py-2 text-sm tracking-wide flex items-center gap-1
                    transition-colors duration-300
                    ${isOpen ? "text-[#c9a96e]" : "text-[#9a9a9a] hover:text-[#c9a96e]"}
                  `}
                >
                  {t(item.labelKey)}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <DropdownMenu
                  items={item.items}
                  open={isOpen}
                  onClose={() => setOpenDropdown(null)}
                />
              </li>
            );
          })}
        </ul>

        {/* ── Desktop CTA (Right) ── */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <Link
            href="/contact"
            className="px-4 py-2 text-sm tracking-wide text-[#9a9a9a] hover:text-[#faf8f5] transition-colors duration-300"
          >
            {t("nav.hubungiKami")}
          </Link>
          <LanguageToggle />
          <button
            onClick={() => setOpen(true)}
            className="relative p-2 text-[#9a9a9a] hover:text-[#c9a96e] transition-colors duration-300"
            aria-label={t("nav.keranjang")}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c9a96e] text-[#0a0a0a] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
          <Link
            href="/templates"
            className="px-5 py-2 text-xs tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors duration-300"
          >
            {t("nav.pesanSekarang")}
          </Link>
        </div>

        {/* ── Mobile Controls ── */}
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageToggle />
          <button
            onClick={() => setOpen(true)}
            className="relative p-2 text-[#9a9a9a] hover:text-[#c9a96e] transition-colors"
            aria-label={t("nav.keranjang")}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c9a96e] text-[#0a0a0a] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
          <button
            className="p-2 text-[#faf8f5] hover:text-[#c9a96e] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("nav.tutupMenu") : t("nav.bukaMenu")}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="bg-[#0f0f0f] border-t border-white/[0.06] px-6 pt-6 pb-8 flex flex-col gap-5">
          {/* Links */}
          {NAV_ITEMS.map((item) => {
            if (item.type === "link") {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base tracking-wide text-[#9a9a9a] hover:text-[#c9a96e] transition-colors py-1"
                >
                  {t(item.labelKey)}
                </Link>
              );
            }
            return (
              <MobileAccordionDropdown
                key={item.labelKey}
                labelKey={item.labelKey}
                items={item.items}
                open={mobileAccordion === item.labelKey}
                onToggle={() => toggleAccordion(item.labelKey)}
              />
            );
          })}

          {/* Hubungi Kami */}
          <div className="pt-2">
            <Link
              href="/contact"
              className="text-sm tracking-wide text-[#9a9a9a] hover:text-[#c9a96e] transition-colors"
            >
              {t("nav.hubungiKami")}
            </Link>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Link
              href="/templates"
              className="inline-block px-6 py-3 text-xs tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium"
            >
              {t("nav.pesanSekarang")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
