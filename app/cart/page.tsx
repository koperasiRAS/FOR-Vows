"use client";

import Link from "next/link";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";
import { formatIDR } from "@/lib/utils";

export default function CartPage() {
  const { t } = useLanguage();
  const { items, removeItem, clearCart, itemCount, totalPrice, openBooking } = useCart();

  const formattedTotal = formatIDR(totalPrice);

  const getTypeBadge = (type: string) => {
    if (type === "template") return "TMPL";
    if (type === "package") return "PAKET";
    return "ADD";
  };

  const getTypeLabel = (type: string) => {
    if (type === "template") return t("cartPage.templateDigital");
    if (type === "package") return t("cartPage.paketLayanan");
    return t("cartPage.addonLabel");
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12">
        {/* Back */}
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#6a6a6a] hover:text-[#c9a96e] transition-colors mb-8"
        >
          <ArrowLeft size={12} />
          {t("cartPage.lanjutPilihTemplate")}
        </Link>

        <ScrollReveal>
          <SectionHeading
            overline={t("cartPage.pesananAnda")}
            title={t("cartPage.keranjang")}
            subtitle={itemCount > 0
              ? t("cartPage.itemCount", { count: itemCount })
              : t("cartPage.keranjangKosong")}
          />
        </ScrollReveal>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center mt-8 border border-white/[0.06]">
            <ShoppingBag size={48} className="text-[#3a3a3a]" />
            <div className="space-y-2">
              <p className="font-serif text-xl text-[#faf8f5]">{t("cartPage.keranjangKosong")}</p>
              <p className="text-sm text-[#6a6a6a]">
                {t("cartPage.belumAdaItem")}
              </p>
            </div>
            <Link
              href="/templates"
              className="mt-2 px-8 py-3.5 text-[11px] tracking-widest uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-colors"
            >
              {t("cartPage.lihatTemplate")}
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
                      {getTypeBadge(item.type)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#faf8f5]">{item.name}</p>
                    <p className="text-xs text-[#6a6a6a] capitalize mt-0.5">
                      {getTypeLabel(item.type)}
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
                    aria-label={t("cart.hapus", { name: item.name })}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border border-white/[0.06] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8a8a8a]">
                  {t("cartPage.subtotal", { count: itemCount })}
                </span>
                <span className="font-serif text-2xl text-[#faf8f5]">{formattedTotal}</span>
              </div>
              <p className="text-xs text-[#4a4a4a]">
                {t("cartPage.belumTermasukAddons")}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <WhatsAppButton
                label={t("cartPage.pesanSekarang")}
                onClick={openBooking}
                className="py-4 flex-1"
              />
              <button
                onClick={clearCart}
                className="px-6 py-4 text-[11px] tracking-widest uppercase border border-white/15 text-[#6a6a6a] hover:text-[#faf8f5] hover:border-white/30 transition-all"
              >
                {t("cartPage.kosongkan")}
              </button>
            </div>

            {/* Info */}
            <div className="p-5 border border-[#c9a96e]/15 bg-[#c9a96e]/5">
              <p className="text-xs text-[#8a8a8a] leading-relaxed">
                <span className="text-[#c9a96e]">Info:</span> {t("cartPage.infoPesan")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
