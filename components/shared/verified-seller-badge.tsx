import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/shared/utils"

const LABEL = "Verified Seller"

interface VerifiedSellerBadgeProps {
  className?: string
  size?: "sm" | "md"
  /** icon = katalog (icon saja), label = detail (icon + teks) */
  variant?: "icon" | "label"
}

export function VerifiedSellerBadge({
  className,
  size = "sm",
  variant = "label",
}: VerifiedSellerBadgeProps) {
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"

  if (variant === "icon") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-800",
          size === "sm" ? "h-5 w-5" : "h-6 w-6",
          className,
        )}
        title={LABEL}
        aria-label={LABEL}
      >
        <BadgeCheck className={iconSize} aria-hidden />
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 font-medium text-blue-800",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className,
      )}
      title={LABEL}
    >
      <BadgeCheck className={iconSize} aria-hidden />
      {LABEL}
    </span>
  )
}
