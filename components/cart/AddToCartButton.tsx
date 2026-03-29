"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n/context";
import type { CartItem } from "@/lib/cart-context";

interface AddToCartButtonProps {
  item: Omit<CartItem, "quantity">;
  variant?: "gold" | "outline";
  label?: string;
  className?: string;
}

export function AddToCartButton({
  item,
  variant = "gold",
  label,
  className = "",
}: AddToCartButtonProps) {
  const { t } = useLanguage();
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const defaultLabel = label ?? t("addToCart.tambahKeranjang");
  const isInCart = items.some((i) => i.id === item.id);

  const handleClick = () => {
    if (isInCart) return;
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isInCart || added) {
    return (
      <div
        className={`flex items-center justify-center gap-2 py-3.5 text-[11px] tracking-[0.18em] uppercase border transition-all duration-300 ${className} border-[#c9a96e]/40 bg-[#c9a96e]/10 text-[#c9a96e] cursor-default`}
      >
        <Check size={14} />
        {added ? t("addToCart.ditambahkan") : t("addToCart.sudahDiKeranjang")}
      </div>
    );
  }

  if (variant === "gold") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 py-3.5 text-[11px] tracking-[0.18em] uppercase bg-[#c9a96e] text-[#0a0a0a] font-medium hover:bg-[#d4b87a] transition-all duration-300 w-full ${className}`}
      >
        <ShoppingBag size={14} />
        {defaultLabel}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 py-3.5 text-[11px] tracking-[0.18em] uppercase border border-white/15 text-[#faf8f5] hover:border-white/30 hover:bg-white/5 transition-all duration-300 w-full ${className}`}
    >
      <ShoppingBag size={14} />
      {defaultLabel}
    </button>
  );
}
