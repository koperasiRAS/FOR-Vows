"use client";

import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useEffect } from "react";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, itemCount, totalPrice, getWhatsAppLink, clearCart } = useCart();

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

  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(totalPrice);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-[#0f0f0f] border-l border-white/[0.08] flex flex-col transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-lg text-[#faf8f5]">Keranjang</h2>
            {itemCount > 0 && (
              <span className="text-[10px] bg-[#c9a96e] text-[#0a0a0a] px-2 py-0.5 rounded-full font-medium">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-[#6a6a6a] hover:text-[#faf8f5] transition-colors"
            aria-label="Tutup keranjang"
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
                <p className="text-[#8a8a8a] text-sm">Keranjang masih kosong</p>
                <p className="text-[#4a4a4a] text-xs mt-1">
                  Pilih template atau paket untuk memulai pesanan
                </p>
              </div>
              <Link
                href="/templates"
                onClick={() => setOpen(false)}
                className="mt-2 px-6 py-2.5 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
              >
                Lihat Template
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
                    <p className="text-xs text-[#6a6a6a] capitalize mt-0.5">
                      {item.type === "template" ? "Template" : item.type === "package" ? "Paket" : "Add-on"}
                    </p>
                    <p className="text-sm text-[#c9a96e] mt-1">{item.price}</p>
                  </div>
                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#4a4a4a] hover:text-red-400 transition-colors shrink-0 mt-1"
                    aria-label="Hapus item"
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
              <span className="text-sm text-[#8a8a8a]">Total</span>
              <span className="font-serif text-xl text-[#faf8f5]">{formattedTotal}</span>
            </div>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 text-[11px] tracking-widest uppercase bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pesan via WhatsApp
            </a>
            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-[#4a4a4a] hover:text-[#8a8a8a] transition-colors"
            >
              Kosongkan Keranjang
            </button>
          </div>
        )}
      </div>
    </>
  );
}
