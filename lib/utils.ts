import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared IDR currency formatter.
 * Defined once at module level — never recreated per render.
 * Use this instead of `new Intl.NumberFormat("id-ID", ...)` inline.
 */
const IDR_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function formatIDR(amount: number): string {
  return IDR_FORMATTER.format(amount);
}

