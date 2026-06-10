"use client"

import { cn } from "@/lib/utils"
import {
  getConnectScoreTierMeta,
  type ConnectScoreTier,
} from "@/lib/connect-score-tier"

interface ConnectScoreTierBadgeProps {
  tier: ConnectScoreTier | null | undefined
  size?: "sm" | "md"
  showScore?: number | null
  className?: string
}

export function ConnectScoreTierBadge({
  tier,
  size = "sm",
  showScore,
  className,
}: ConnectScoreTierBadgeProps) {
  const meta = getConnectScoreTierMeta(tier)
  if (!meta) return null

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold",
        meta.className,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className,
      )}
    >
      {meta.label}
      {showScore != null && <span className="opacity-75">({showScore})</span>}
    </span>
  )
}
