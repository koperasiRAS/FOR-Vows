// Midtrans Snap utility — loads script and triggers payment popup
// Ref: https://docs.midtrans.com/reference/snap-js

import { MIDTRANS_SNAP_BASE_URL } from "@/lib/config";

const SNAP_SCRIPT_ID = "midtrans-snap-script";



// [SECURITY] Amount is now recalculated server-side — do not trust client-supplied amount.
// The `amount` field is kept for backward compatibility but is ignored by the server.
export async function getSnapToken(data: {
  bookingId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  amount?: number;
  items: Array<{ name: string; price: number; quantity: number }>;
  userId?: string; // ownership verification
}): Promise<{ token: string; orderId: string }> {
  const res = await fetch("/api/midtrans/create-snap-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!json.success || !json.token) {
    throw new Error(json.error ?? "Gagal membuat token pembayaran");
  }

  return { token: json.token, orderId: json.orderId };
}

export function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Cannot load Snap on server"));
      return;
    }

    // Already loaded
    if (document.getElementById(SNAP_SCRIPT_ID) || (window as unknown as Record<string, unknown>)["snap"]) {
      resolve();
      return;
    }

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    if (!clientKey) {
      reject(new Error("NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is not set"));
      return;
    }

    const script = document.createElement("script");
    script.id = SNAP_SCRIPT_ID;
    script.src = `${MIDTRANS_SNAP_BASE_URL}/snap/v2/transactions/${clientKey}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap"));
    document.head.appendChild(script);
  });
}

export async function openSnapPopup(token: string): Promise<void> {
  await loadSnapScript();

  const snap = (window as unknown as Record<string, unknown>)["snap"] as Record<string, (token: string, options?: Record<string, unknown>) => void> | undefined;
  if (!snap) {
    throw new Error("Midtrans Snap tidak tersedia");
  }

  return new Promise((resolve, reject) => {
    snap.pay(token, {
      onSuccess: () => resolve(),
      onPending: () => resolve(),
      onError: () => reject(new Error("Pembayaran gagal")),
      onClose: () => reject(new Error("Popup ditutup sebelum pembayaran selesai")),
    });
  });
}
