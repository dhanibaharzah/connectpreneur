import { Award, BadgeCheck, Sparkles } from "lucide-react"
import { cn } from "@/lib/shared/utils"
import { BUYER_BADGE_LABELS, type BuyerBadgeLevel } from "@/types/gamification"

interface BuyerBadgeProps {
  level: BuyerBadgeLevel
  className?: string
  size?: "sm" | "md"
}

const LEVEL_STYLES: Record<
  BuyerBadgeLevel,
  { border: string; bg: string; text: string; Icon: typeof Award }
> = {
  new: {
    border: "border-slate-200",
    bg: "bg-slate-50",
    text: "text-slate-700",
    Icon: Sparkles,
  },
  verified: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-800",
    Icon: BadgeCheck,
  },
  top: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    text: "text-orange-900",
    Icon: Award,
  },
}

export function BuyerBadge({ level, className, size = "sm" }: BuyerBadgeProps) {
  const style = LEVEL_STYLES[level]
  const Icon = style.Icon

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
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />
      {BUYER_BADGE_LABELS[level]}
    </span>
  )
}
