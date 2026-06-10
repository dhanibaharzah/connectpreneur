"use client"

import { cn } from "@/lib/utils"
import {
  CONNECT_SCORE_TIER_ALL,
  CONNECT_SCORE_TIERS,
  type ConnectScoreTierFilter,
} from "@/lib/connect-score-tier"

interface ConnectScoreTierFilterProps {
  selectedTier: ConnectScoreTierFilter
  onTierChange: (tier: ConnectScoreTierFilter) => void
  tierCounts?: Partial<Record<ConnectScoreTierFilter, number>>
  className?: string
}

export function ConnectScoreTierFilter({
  selectedTier,
  onTierChange,
  tierCounts = {},
  className,
}: ConnectScoreTierFilterProps) {
  const options: ConnectScoreTierFilter[] = [CONNECT_SCORE_TIER_ALL, ...CONNECT_SCORE_TIERS.map((t) => t.id)]

  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
      {options.map((tier) => {
        const label =
          tier === CONNECT_SCORE_TIER_ALL
            ? CONNECT_SCORE_TIER_ALL
            : CONNECT_SCORE_TIERS.find((item) => item.id === tier)?.label ?? tier
        const count = tierCounts[tier]

        return (
          <button
            key={tier}
            type="button"
            onClick={() => onTierChange(tier)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
              selectedTier === tier
                ? "bg-primary text-white shadow-md"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {label}
            {count != null && <span className="ml-1 opacity-70">({count})</span>}
          </button>
        )
      })}
    </div>
  )
}
