/**
 * Centralized package definitions — single source of truth for all 3 pricing tiers.
 * Used by PricingSection, OrderModal, and any future pricing UI.
 *
 * IMPORTANT: Do NOT add prices to template data. Templates are selections;
 * packages are what you buy. Prices belong here only.
 */

export type PackageKey = "basic" | "premium" | "exclusive";

export interface Package {
  key: PackageKey;
  /** Display label */
  label: string;
  /** Human-readable price string for UI */
  priceLabel: string;
  /** Numeric price in Rupiah (for calculations) */
  priceValue: number;
  /** Short starting-from label for cards */
  priceId: string;
  priceEn: string;
  gradient: string;
  accent: string;
  border: string;
  featured?: boolean;
}

export const PACKAGES: Package[] = [
  {
    key: "basic",
    label: "Basic",
    priceLabel: "Rp 299.000",
    priceValue: 299000,
    priceId: "Mulai dari Rp 299.000",
    priceEn: "Starting from Rp 299.000",
    gradient: "from-[#1a1206] to-[#2a2010]",
    accent: "#c9a96e",
    border: "rgba(201,169,110,0.15)",
  },
  {
    key: "premium",
    label: "Premium",
    priceLabel: "Rp 599.000",
    priceValue: 599000,
    priceId: "Mulai dari Rp 599.000",
    priceEn: "Starting from Rp 599.000",
    gradient: "from-[#1a1206] to-[#3d2e0f]",
    accent: "#c9a96e",
    border: "rgba(201,169,110,0.35)",
    featured: true,
  },
  {
    key: "exclusive",
    label: "Exclusive",
    priceLabel: "Rp 999.000",
    priceValue: 999000,
    priceId: "Custom",
    priceEn: "Custom",
    gradient: "from-[#1a0a06] to-[#2a1508]",
    accent: "#c9a96e",
    border: "rgba(201,169,110,0.2)",
  },
];

/** Lookup a package by its key */
export function getPackage(key: PackageKey): Package {
  return PACKAGES.find((p) => p.key === key) ?? PACKAGES[1];
}

/** Format a price value as "Rp X.XXX.XXX" */
export function formatPrice(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}
