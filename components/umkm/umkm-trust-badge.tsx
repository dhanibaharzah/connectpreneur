import { BadgeCheck, ShieldCheck, Star } from "lucide-react"
import { cn } from "@/lib/shared/utils"
import { TRUST_TIER_LABELS, type TrustTier } from "@/types/gamification"

interface UmkmTrustBadgeProps {
  tier: TrustTier
  className?: string
  size?: "sm" | "md"
  /** icon = katalog (icon saja), label = detail (icon + teks) */
  variant?: "icon" | "label"
}

const TIER_STYLES: Record<TrustTier, { border: string; bg: string; text: string; Icon: typeof Star }> = {
  hundred_percent: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    Icon: BadgeCheck,
  },
  trusted: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-900",
    Icon: ShieldCheck,
  },
  star: {
    border: "border-violet-200",
    bg: "bg-violet-50",
    text: "text-violet-900",
    Icon: Star,
  },
}

export function UmkmTrustBadge({
  tier,
  className,
  size = "sm",
  variant = "label",
}: UmkmTrustBadgeProps) {
  const style = TIER_STYLES[tier]
  const Icon = style.Icon
  const label = TRUST_TIER_LABELS[tier]
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"

  if (variant === "icon") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border font-medium",
          style.border,
          style.bg,
          style.text,
          size === "sm" ? "h-5 w-5" : "h-6 w-6",
          className,
        )}
        title={label}
        aria-label={label}
      >
        <Icon className={iconSize} aria-hidden />
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        style.border,
        style.bg,
        style.text,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className,
      )}
      title={label}
    >
      <Icon className={iconSize} aria-hidden />
      {label}
    </span>
  )
}
