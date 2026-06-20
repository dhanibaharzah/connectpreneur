"use client"

import { forwardRef, type ComponentPropsWithoutRef, type ComponentType } from "react"
import { ChevronDown, Filter, ArrowUpDown, Check, MapPin } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { ProductTipeBisnis } from "@/types/business-product"
import { MARKETPLACE_SORT_LABELS, type MarketplaceSort } from "@/types/marketplace-product"

const FilterDropdownTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button"> & {
    icon: ComponentType<{ className?: string }>
    label: string
    active?: boolean
  }
>(function FilterDropdownTrigger({ icon: Icon, label, active, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      {...props}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted/50",
        active ? "border-primary text-primary" : "border-border text-foreground",
        className,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="max-w-[120px] truncate">{label}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  )
})

export type TipeFilter = ProductTipeBisnis | "all"

const TIPE_OPTIONS: { value: TipeFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "produk", label: "Produk" },
  { value: "jasa", label: "Jasa" },
]

interface ProductFiltersProps {
  tipe: TipeFilter
  location: string
  sort: MarketplaceSort
  locations: string[]
  onTipeChange: (tipe: TipeFilter) => void
  onLocationChange: (location: string) => void
  onSortChange: (sort: MarketplaceSort) => void
}

export function ProductFilters({
  tipe,
  location,
  sort,
  locations,
  onTipeChange,
  onLocationChange,
  onSortChange,
}: ProductFiltersProps) {
  const locationLabel = location || "Semua Lokasi"
  const sortLabel = MARKETPLACE_SORT_LABELS[sort]

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TIPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onTipeChange(option.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tipe === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <FilterDropdownTrigger icon={MapPin} label={locationLabel} active={Boolean(location)} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-y-auto">
            <DropdownMenuItem
              onClick={() => onLocationChange("")}
              className="flex items-center justify-between"
            >
              <span>Semua Lokasi</span>
              {!location && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
            {locations.map((loc) => (
              <DropdownMenuItem
                key={loc}
                onClick={() => onLocationChange(loc)}
                className="flex items-center justify-between"
              >
                <span className="truncate">{loc}</span>
                {location === loc && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <FilterDropdownTrigger
              icon={ArrowUpDown}
              label={sortLabel}
              active={sort !== "terbaru"}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {(Object.keys(MARKETPLACE_SORT_LABELS) as MarketplaceSort[]).map((key) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onSortChange(key)}
                className="flex items-center justify-between"
              >
                <span>{MARKETPLACE_SORT_LABELS[key]}</span>
                {sort === key && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {(location || sort !== "terbaru") && (
          <button
            type="button"
            onClick={() => {
              onLocationChange("")
              onSortChange("terbaru")
            }}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground hover:bg-muted/50"
          >
            <Filter className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
