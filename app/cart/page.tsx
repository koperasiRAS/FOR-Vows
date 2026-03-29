"use client";

import Link from "next/link";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export default function CartPage() {
  const { items, removeItem, clearCart, itemCount, totalPrice, openBooking } = useCart();

  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(totalPrice);

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12">
        {/* Back */}
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#6a6a6a] hover:text-[#c9a96e] transition-colors mb-8"
        >
          <ArrowLeft size={12} />
          Lanjut Pilih Template
        </Link>

        <ScrollReveal>
          <SectionHeading
            overline="Pesanan Anda"
            title="Keranjang"
            subtitle={itemCount > 0 ? `${itemCount} item dalam keranjang` : "Keranjang masih kosong"}
          />
        </ScrollReveal>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center mt-8 border border-white/[0.06]">
            <ShoppingBag size={48} className="text-[#3a3a3a]" />
            <div className="space-y-2">
              <p className="font-serif text-xl text-[#faf8f5]">Keranjang Kosong</p>
              <p className="text-sm text-[#6a6a6a]">
                Belum ada item di keranjang. Pilih template atau paket untuk memulai.
              </p>
            </div>
            <Link
              href="/templates"
              className="mt-2 px-8 py-3.5 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
            >
              Lihat Template
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {/* Cart Items */}
            <div className="divide-y divide-white/[0.06] border border-white/[0.06]">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-5 p-6">
                  {/* Type badge */}
                  <div className="w-12 h-12 bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-[#c9a96e] uppercase tracking-wider">
                      {item.type === "template" ? "TMPL" : item.type === "package" ? "PAKET" : "ADD"}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#faf8f5]">{item.name}</p>
                    <p className="text-xs text-[#6a6a6a] capitalize mt-0.5">
                      {item.type === "template" ? "Template Undangan Digital" : item.type === "package" ? "Paket Layanan" : "Add-on"}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-sm text-[#c9a96e]">{item.price}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-[#4a4a4a]">x{item.quantity}</p>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-[#4a4a4a] hover:text-red-400 transition-colors shrink-0"
                    aria-label="Hapus"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border border-white/[0.06] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8a8a8a]">Subtotal ({itemCount} item)</span>
                <span className="font-serif text-2xl text-[#faf8f5]">{formattedTotal}</span>
              </div>
              <p className="text-xs text-[#4a4a4a]">
                Harga belum termasuk add-on tambahan. Add-ons dapat dipilih setelah pemesanan.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={openBooking}
                className="flex-1 flex items-center justify-center gap-2.5 py-4 text-[11px] tracking-widest uppercase bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Pesan Sekarang
              </button>
              <button
                onClick={clearCart}
                className="px-6 py-4 text-[11px] tracking-widest uppercase border border-white/15 text-[#6a6a6a] hover:text-[#faf8f5] hover:border-white/30 transition-all"
              >
                Kosongkan
              </button>
            </div>

            {/* Info */}
            <div className="p-5 border border-[#c9a96e]/15 bg-[#c9a96e]/5">
              <p className="text-xs text-[#8a8a8a] leading-relaxed">
                <span className="text-[#c9a96e]">Info:</span> Setelah mengirim pesanan via WhatsApp, tim FOR Vows akan menghubungi Anda dalam 24 jam untuk konfirmasi detail dan metode pembayaran.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
