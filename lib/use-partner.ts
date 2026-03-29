"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { PARTNER_COOKIE } from "@/lib/partners";

interface PartnerCookie {
  id: string;
  displayName: string;
  referralCode: string;
}

function readPartnerCookie(): PartnerCookie | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${PARTNER_COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(
      match.split("=").slice(1).join("=")
    ) as PartnerCookie;
  } catch {
    return null;
  }
}

/**
 * Reads the `forvows_partner` HttpOnly cookie (set by proxy.ts) and seeds
 * the cart's `pendingCustomer.referralCode` so the BookingModal opens
 * pre-populated with the partner's referral code.
 *
 * Runs once on mount only — it will NOT overwrite a referral code the user
 * has already typed manually in the current session.
 * SSR-safe: reads `document.cookie` only on the client.
 */
export function usePartner() {
  const { setPendingCustomer, pendingCustomer } = useCart();

  useEffect(() => {
    // Only seed if the cart has no referral code yet.
    // This preserves any manual entry from the current session.
    if (pendingCustomer && pendingCustomer.referralCode.trim() !== "") {
      return;
    }

    const partner = readPartnerCookie();
    if (!partner) return;

    setPendingCustomer({
      name: "",
      whatsapp: "",
      referralCode: partner.referralCode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount only
}
