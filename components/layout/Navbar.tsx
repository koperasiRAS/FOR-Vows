"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

const navLinks = [
  { href: "/templates", key: "nav.template" },
  { href: "/pricing", key: "nav.harga" },
  { href: "/features", key: "nav.fitur" },
  { href: "/how-it-works", key: "nav.caraPesan" },
  { href: "/portfolio", key: "nav.portfolio" },
  { href: "/about", key: "nav.tentang" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, setOpen } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 lg:h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-auto">
            <Image
              src="/images/logo-brand.png"
              alt="FOR Vows"
              width={160}
              height={40}
              className="h-full w-auto object-contain group-hover:opacity-80 transition-opacity"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm tracking-wide text-[#9a9a9a] hover:text-[#c9a96e] transition-colors duration-300 relative group"
              >
                {t(link.key)}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#c9a96e] transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/contact"
            className="text-sm tracking-wide text-[#9a9a9a] hover:text-[#faf8f5] transition-colors duration-300"
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

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageToggle />
          <Link
            href="/cart"
            className="p-2 text-[#9a9a9a] hover:text-[#c9a96e] transition-colors"
            aria-label={t("nav.keranjang")}
          >
            <ShoppingBag size={20} />
          </Link>
          <button
            className="p-2 text-[#faf8f5] hover:text-[#c9a96e] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("nav.tutupMenu") : t("nav.bukaMenu")}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="bg-[#0f0f0f] border-t border-white/[0.06] px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base tracking-wide text-[#9a9a9a] hover:text-[#c9a96e] transition-colors py-1"
            >
              {t(link.key)}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/[0.06]">
            <Link
              href="/templates"
              onClick={() => setMobileOpen(false)}
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
