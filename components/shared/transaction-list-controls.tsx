"use client"

import { forwardRef, type ComponentPropsWithoutRef, type ComponentType } from "react"
import { ArrowUpDown, Check, ChevronDown, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  TRANSACTION_SORT_LABELS,
  TRANSACTION_SORTS,
  type TransactionSort,
} from "@/lib/transactions/transaction-list-filters"
import { cn } from "@/lib/shared/utils"

const SortDropdownTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button"> & { label: string; active?: boolean }
>(function SortDropdownTrigger({ label, active, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Urutkan transaksi"
      {...props}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted/50",
        active ? "border-primary text-primary" : "border-border text-foreground",
        className,
      )}
    >
      <ArrowUpDown className="h-4 w-4 shrink-0" />
      <span className="max-w-[140px] truncate">{label}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  )
})

interface TransactionListControlsProps {
  search: string
  sort: TransactionSort
  onSearchChange: (value: string) => void
  onSortChange: (sort: TransactionSort) => void
  searchPlaceholder?: string
  disabled?: boolean
}

export function TransactionListControls({
  search,
  sort,
  onSearchChange,
  onSortChange,
  searchPlaceholder = "Cari no. referensi...",
  disabled = false,
}: TransactionListControlsProps) {
  const sortLabel = TRANSACTION_SORT_LABELS[sort]

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          disabled={disabled}
          className="pl-9"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <SortDropdownTrigger label={sortLabel} active={sort !== "terbaru"} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {TRANSACTION_SORTS.map((option) => (
            <DropdownMenuItem key={option} onClick={() => onSortChange(option)}>
              {TRANSACTION_SORT_LABELS[option]}
              {sort === option && <Check className="ml-auto h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
