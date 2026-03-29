/**
 * Referral code system — FOR Vows MVP
 *
 * Referral codes are hardcoded here for now. Each code maps to a referrer
 * name and a discount. In a later phase this would be stored in the database.
 *
 * Code format: uppercase alphanumeric string, stored in localStorage on the
 * referrer's behalf. Discounts are applied at booking time (displayed in
 * the BookingModal order summary and included in the WhatsApp message).
 */

export type DiscountType = "percentage" | "fixed";

export interface ReferralCode {
  /** Display name of the referrer (shown in WhatsApp message) */
  referrerName: string;
  /** How the discount is calculated */
  discountType: DiscountType;
  /** Value: percentage (0-100) or fixed amount in IDR */
  discountValue: number;
  /** Optional note shown alongside the discount */
  note?: string;
}

/**
 * Active referral codes.
 * Key: the code string (stored uppercase, matched case-insensitively).
 * Value: referral metadata.
 */
export const REFERRAL_CODES: Record<string, ReferralCode> = {
  // Example: first-wave beta couples
  ANISA2026: {
    referrerName: "Anisa & Rizky",
    discountType: "percentage",
    discountValue: 10,
    note: "Diskon 10% dari paket Premium",
  },
  DEWI2026: {
    referrerName: "Dewi & Fachry",
    discountType: "percentage",
    discountValue: 10,
    note: "Diskon 10% dari paket Premium",
  },
  SARAH2026: {
    referrerName: "Sarah & Michael",
    discountType: "percentage",
    discountValue: 10,
    note: "Diskon 10% dari paket Premium",
  },
  // Partner / vendor codes
  FORVLAUNCH: {
    referrerName: "FOR Vows Launch",
    discountType: "percentage",
    discountValue: 15,
    note: "Diskon 15% — Welcome Offer",
  },
  FRAMEOFRANGGA: {
    referrerName: "Frame Of Rangga",
    discountType: "percentage",
    discountValue: 10,
    note: "Diskon 10% — FOR Family",
  },
};

/** Normalize a code string for lookup. */
function normalize(code: string): string {
  return code.trim().toUpperCase();
}

/** Result of validating a referral code. */
export interface ReferralValidation {
  valid: boolean;
  code: string;
  referral?: ReferralCode;
}

/**
 * Validate a referral code string.
 * Returns a ReferralValidation object regardless of whether it's valid —
 * the caller decides how to surface the result.
 */
export function validateReferralCode(code: string): ReferralValidation {
  const normalized = normalize(code);
  if (!normalized) return { valid: false, code: "" };
  const referral = REFERRAL_CODES[normalized];
  if (!referral) return { valid: false, code: normalized };
  return { valid: true, code: normalized, referral };
}

/** Format a discount as a human-readable string. */
export function formatDiscount(referral: ReferralCode, lang: "id" | "en" = "id"): string {
  if (referral.discountType === "percentage") {
    return lang === "id"
      ? `Diskon ${referral.discountValue}%`
      : `${referral.discountValue}% off`;
  }
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(referral.discountValue);
  return lang === "id" ? `Diskon ${formatted}` : `${formatted} off`;
}

/**
 * Calculate the discount amount given a subtotal and referral code.
 * Returns null if the code is invalid or no code is provided.
 */
export function calculateDiscount(
  subtotal: number,
  code: string
): { referral: ReferralCode; amount: number } | null {
  const validation = validateReferralCode(code);
  if (!validation.valid || !validation.referral) return null;

  const { referral } = validation;
  if (referral.discountType === "percentage") {
    return { referral, amount: Math.round(subtotal * (referral.discountValue / 100)) };
  }
  // Fixed amount — cap at subtotal
  return { referral, amount: Math.min(referral.discountValue, subtotal) };
}
