"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/shared/utils"

interface ExpandableListItemProps {
  open: boolean
  onToggle: () => void
  title: React.ReactNode
  subtitle?: React.ReactNode
  trailing?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function ExpandableListItem({
  open,
  onToggle,
  title,
  subtitle,
  trailing,
  children,
  className,
}: ExpandableListItemProps) {
  return (
    <div className={cn("border-b last:border-b-0", className)}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/40 sm:px-4"
        aria-expanded={open}
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">{title}</div>
          {subtitle && (
            <div className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</div>
          )}
        </div>
        {trailing && <div className="flex shrink-0 items-center gap-2">{trailing}</div>}
      </button>
      {open && children && (
        <div className="space-y-3 border-t bg-muted/20 px-3 py-3 sm:px-4 sm:pl-11">
          {children}
        </div>
      )}
    </div>
  )
}

interface ExpandableListProps {
  children: React.ReactNode
  className?: string
  emptyMessage?: string
  isEmpty?: boolean
}

export function ExpandableList({
  children,
  className,
  emptyMessage = "Tidak ada data.",
  isEmpty = false,
}: ExpandableListProps) {
  if (isEmpty) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border bg-white", className)}>
      {children}
    </div>
  )
}
