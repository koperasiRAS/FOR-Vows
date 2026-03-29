/**
 * Partner registry — FOR Vows White-label MVP
 *
 * Each partner maps to a unique ID (used as subdomain and ?partner= param)
 * and carries metadata. In Phase 1, only referralCode is used to auto-populate
 * the booking modal. Phase 2 adds white-label branding (accentColor, logoUrl,
 * exclusive template sets) and Phase 3 would move this to a database.
 */

export interface Partner {
  /** Unique lowercase ID — used as subdomain and in ?partner= param */
  id: string;
  /** Display name shown in admin / internal tools */
  displayName: string;
  /** Brand tagline shown in hero (Phase 2 white-label) */
  tagline?: string;
  /** Canonical domain if partner has their own domain (Phase 2) */
  domain?: string;
  /** FOR Vows referral code associated with this partner */
  referralCode: string;
  /** Accent color for partner white-label (Phase 2) */
  accentColor?: string;
  /** Logo URL for partner white-label (Phase 2) */
  logoUrl?: string;
  /** IDs of templates exclusively available to this partner (Phase 2) */
  exclusiveTemplateIds?: string[];
  /** Partner-specific template set key (Phase 2) */
  templateSet?: string;
  /** Whether this partner is active */
  active: boolean;
}

/**
 * Active partner registry.
 * Key: partner ID (lowercase, no spaces — safe for subdomains and URL params).
 */
export const PARTNERS: Record<string, Partner> = {
  frameofrangga: {
    id: "frameofrangga",
    displayName: "Frame Of Rangga",
    tagline: "Frame Of Rangga × FOR Vows",
    referralCode: "FRAMEOFRANGGA",
    active: true,
  },
  // Example future partners — add here as they are onboarded
  // anisa: {
  //   id: "anisa",
  //   displayName: "Anisa & Rizky",
  //   referralCode: "ANISA2026",
  //   active: false,
  // },
};

export const PARTNER_COOKIE = "forvows_partner";

/** Look up an active partner by its ID. */
export function getPartnerById(id: string): Partner | null {
  const key = id.trim().toLowerCase();
  const partner = PARTNERS[key];
  if (!partner || !partner.active) return null;
  return partner;
}

/** Find the partner whose referralCode matches the given code. */
export function getPartnerByReferralCode(code: string): Partner | null {
  const normalised = code.trim().toUpperCase();
  return (
    Object.values(PARTNERS).find(
      (p) => p.referralCode === normalised && p.active
    ) ?? null
  );
}
