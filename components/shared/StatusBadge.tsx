"use client";

import { cn } from "@/lib/utils";

type OrderStatus =
  | "pending"
  | "waiting_payment"
  | "paid"
  | "in_progress"
  | "revision"
  | "completed";

interface StatusBadgeProps {
  status: OrderStatus | string;
  lang?: "id" | "en";
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  string,
  {
    labelId: string;
    labelEn: string;
    bg: string;
    border: string;
    text: string;
  }
> = {
  pending: {
    labelId: "Menunggu",
    labelEn: "Pending",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
  },
  waiting_payment: {
    labelId: "Menunggu Pembayaran",
    labelEn: "Awaiting Payment",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
  },
  paid: {
    labelId: "Sudah Bayar",
    labelEn: "Paid",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
  in_progress: {
    labelId: "Sedang Dikerjakan",
    labelEn: "In Progress",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
  },
  revision: {
    labelId: "Revisi",
    labelEn: "Revision",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
  completed: {
    labelId: "Selesai",
    labelEn: "Completed",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
  },
};

export function StatusBadge({ status, lang = "id", size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    labelId: status,
    labelEn: status,
    bg: "bg-white/5",
    border: "border-white/10",
    text: "text-[#8a8a8a]",
  };

  return (
    <span
      className={cn(
        "inline-block border tracking-wider uppercase",
        config.bg,
        config.border,
        config.text,
        size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-3 py-1 text-xs"
      )}
    >
      {lang === "id" ? config.labelId : config.labelEn}
    </span>
  );
}

/** Returns whether an order needs payment action */
export function needsPayment(status: string): boolean {
  return status === "pending" || status === "waiting_payment";
}

/** Returns whether an order is in a terminal/completed state */
export function isCompleted(status: string): boolean {
  return status === "completed";
}
