// Centralized public configuration — values sourced from environment variables.
// These are safe to expose to the browser via NEXT_PUBLIC_ prefix.

export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6287779560264";

/** Virtual account number for manual transfer instructions (e.g. BCA / 1234567890) */
export const PAYMENT_VA_DISPLAY = process.env.NEXT_PUBLIC_PAYMENT_VA_DISPLAY ?? "";

/** Account name shown in payment instructions (e.g. FOR Vows) */
export const PAYMENT_ACCOUNT_NAME = process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME ?? "FOR Vows";

export const MIDTRANS_SNAP_BASE_URL = (() => {
  if (process.env.MIDTRANS_SNAP_BASE_URL) {
    return process.env.MIDTRANS_SNAP_BASE_URL;
  }
  // Fallback based on MIDTRANS_IS_PRODUCTION flag
  if (process.env.MIDTRANS_IS_PRODUCTION === "true") {
    return "https://app.midtrans.com";
  }
  return "https://app.sandbox.midtrans.com";
})();
