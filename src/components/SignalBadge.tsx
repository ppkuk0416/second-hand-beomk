"use client";

import { DealSignal } from "@/lib/types";

const CONFIG = {
  good: {
    dot: "bg-green-400",
    text: "text-green-400",
    bg: "bg-green-900/60 border-green-700/50",
    label: "구매 추천",
  },
  fair: {
    dot: "bg-yellow-400",
    text: "text-yellow-400",
    bg: "bg-yellow-900/60 border-yellow-700/50",
    label: "보통 거래",
  },
  bad: {
    dot: "bg-red-400",
    text: "text-red-400",
    bg: "bg-red-900/60 border-red-700/50",
    label: "비추천",
  },
};

interface SignalBadgeProps {
  signal: DealSignal;
  size?: "sm" | "md";
}

export function SignalBadge({ signal, size = "sm" }: SignalBadgeProps) {
  const c = CONFIG[signal];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${c.bg} ${c.text} ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"}`}
    >
      <span className={`rounded-full shrink-0 ${c.dot} ${size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5"}`} />
      {c.label}
    </span>
  );
}
