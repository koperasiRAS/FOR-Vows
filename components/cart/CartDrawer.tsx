"use client";

import Link from "next/link";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n/context";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";

// ── Static type map — defined outside component to avoid recreation ────────────
const TYPE_KEYS = {
  template: "cart.template",
  package: "cart.paket",
  addon: "cart.addon",
  save_the_date: "cart.saveTheDate",
  website: "cart.website",
} as const;

const IDR_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});


export function CartDrawer() {
  const { t } = useLanguage();
  const { items, isOpen, setOpen, removeItem, itemCount, totalPrice, clearCart } = useCart();
  const drawerRef = useFocusTrap(isOpen);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Memoize formatted total — only recomputes when totalPrice changes
  const formattedTotal = useMemo(() => IDR_FORMATTER.format(totalPrice), [totalPrice]);

  const getTypeLabel = (type: string) => {
    const key = TYPE_KEYS[type as keyof typeof TYPE_KEYS];
    return key ? t(key) : type;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label={t("cart.tutupKeranjang")}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen(false); }}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-[#0f0f0f] border-l border-white/[0.08] flex flex-col transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <h2 id="cart-drawer-title" className="font-serif text-lg text-[#faf8f5]">{t("cart.keranjang")}</h2>
            {itemCount > 0 && (
              <span className="text-[10px] bg-[#c9a96e] text-[#0a0a0a] px-2 py-0.5 rounded-full font-medium">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-[#6a6a6a] hover:text-[#faf8f5] transition-colors"
            aria-label={t("cart.tutupKeranjang")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <ShoppingBag size={40} className="text-[#3a3a3a]" />
              <div>
                <p className="text-[#8a8a8a] text-sm">{t("cart.keranjangKosong")}</p>
                <p className="text-[#4a4a4a] text-xs mt-1">{t("cart.pilihTemplateAtauPaket")}</p>
              </div>
              <Link
                href="/templates"
                onClick={() => setOpen(false)}
                className="mt-2 px-6 py-2.5 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
              >
                {t("cart.lihatTemplate")}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.05]">
              {items.map((item) => (
                <li key={item.id} className="px-6 py-5 flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-[#c9a96e] uppercase">{item.type[0]}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#faf8f5] truncate">{item.name}</p>
                    <p className="text-xs text-[#6a6a6a] mt-0.5">{getTypeLabel(item.type)}</p>
                    <p className="text-sm text-[#c9a96e] mt-1">{item.price}</p>
                  </div>
                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#4a4a4a] hover:text-red-400 transition-colors shrink-0 mt-1"
                    aria-label={`${t("cart.hapus")} — ${item.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/[0.06] px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8a8a8a]">{t("cart.total")}</span>
              <span className="font-serif text-xl text-[#faf8f5]">{formattedTotal}</span>
            </div>
            <Link
              href="/order"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center py-3.5 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
            >
              {t("cart.pesanSekarang")}
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-[#4a4a4a] hover:text-[#8a8a8a] transition-colors"
            >
              {t("cart.kosongkan")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
