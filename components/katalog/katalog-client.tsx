"use client"

import { useState, useMemo, useEffect, useRef, forwardRef, type ComponentPropsWithoutRef, type ComponentType } from "react"
import {
  Search,
  ChevronDown,
  LayoutGrid,
  Filter,
  ArrowUpDown,
  Check,
} from "lucide-react"
import { BusinessCard } from "@/components/katalog/business-card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Business } from "@/types/business"
import {
  CONNECT_SCORE_TIER_ALL,
  CONNECT_SCORE_TIERS,
  type ConnectScoreTierFilter as ConnectScoreTierFilterValue,
} from "@/lib/business/connect-score-tier"
import { cn } from "@/lib/shared/utils"
import { htmlToPlainText } from "@/lib/shared/html-text"

const MOBILE_PAGE_SIZE = 5
const DESKTOP_PAGE_SIZE = 12

function useCatalogPageSize() {
  const [pageSize, setPageSize] = useState(MOBILE_PAGE_SIZE)

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)")
    const update = () => setPageSize(media.matches ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return pageSize
}

type SortOption = "default" | "name_asc" | "score_desc"

const SORT_LABELS: Record<SortOption, string> = {
  default: "Urutkan",
  name_asc: "Nama A–Z",
  score_desc: "ConnectScore Tertinggi",
}

const FilterDropdownTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button"> & {
    icon: ComponentType<{ className?: string }>
    label: string
    active?: boolean
    variant?: "full" | "icon"
  }
>(function FilterDropdownTrigger(
  { icon: Icon, label, active, variant = "full", className, ...props },
  ref,
) {
  const isIconOnly = variant === "icon"

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      {...props}
      className={cn(
        "inline-flex h-11 shrink-0 items-center justify-center rounded-lg border bg-card text-sm font-medium transition-colors hover:bg-muted/50",
        isIconOnly ? "w-11 px-0" : "gap-2 px-3",
        active ? "border-primary text-primary" : "border-border text-foreground",
        className,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isIconOnly && <span className="max-w-[120px] truncate">{label}</span>}
      {!isIconOnly && <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </button>
  )
})

interface KatalogClientProps {
  businesses: Business[]
  categories: string[]
}

export function KatalogClient({ businesses, categories }: KatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [selectedTier, setSelectedTier] = useState<ConnectScoreTierFilterValue>(CONNECT_SCORE_TIER_ALL)
  const [sortBy, setSortBy] = useState<SortOption>("default")
  const [visibleCount, setVisibleCount] = useState(MOBILE_PAGE_SIZE)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const pageSize = useCatalogPageSize()

  const businessCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    businesses.forEach((business) => {
      const cat = business.jenisUsaha
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [businesses])

  const availableCategories = useMemo(
    () => ["Semua", ...categories.filter((cat) => cat !== "Semua" && businessCounts[cat] > 0)],
    [categories, businessCounts],
  )

  const tierCounts = useMemo(() => {
    const counts: Partial<Record<ConnectScoreTierFilterValue, number>> = {
      [CONNECT_SCORE_TIER_ALL]: businesses.length,
    }
    businesses.forEach((business) => {
      if (!business.connectScoreTier) return
      counts[business.connectScoreTier] = (counts[business.connectScoreTier] || 0) + 1
    })
    return counts
  }, [businesses])

  const filteredBusinesses = useMemo(() => {
    const list = businesses.filter((business) => {
      const matchesSearch =
        business.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        htmlToPlainText(business.deskripsi).toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.kotaProvinsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.jenisUsaha.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "Semua" || business.jenisUsaha === selectedCategory
      const matchesTier =
        selectedTier === CONNECT_SCORE_TIER_ALL || business.connectScoreTier === selectedTier

      return matchesSearch && matchesCategory && matchesTier
    })

    if (sortBy === "name_asc") {
      list.sort((a, b) => a.nama.localeCompare(b.nama, "id"))
    } else if (sortBy === "score_desc") {
      list.sort((a, b) => (b.connectScore ?? 0) - (a.connectScore ?? 0))
    }

    return list
  }, [businesses, searchQuery, selectedCategory, selectedTier, sortBy])

  useEffect(() => {
    setVisibleCount(pageSize)
  }, [searchQuery, selectedCategory, selectedTier, sortBy, pageSize])

  const visibleBusinesses = filteredBusinesses.slice(0, visibleCount)
  const hasMore = visibleCount < filteredBusinesses.length

  useEffect(() => {
    const node = loadMoreRef.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + pageSize, filteredBusinesses.length))
        }
      },
      { rootMargin: "240px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, pageSize, filteredBusinesses.length])

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + pageSize, filteredBusinesses.length))
  }

  const categoryDropdownLabel =
    selectedCategory === "Semua" ? "Semua Kategori" : selectedCategory

  const tierDropdownLabel =
    selectedTier === CONNECT_SCORE_TIER_ALL
      ? "ConnectScore"
      : CONNECT_SCORE_TIERS.find((t) => t.id === selectedTier)?.label ?? "ConnectScore"

  const hasActiveFilters = selectedCategory !== "Semua" || selectedTier !== CONNECT_SCORE_TIER_ALL

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">Katalog Bisnis Kemitraan</h1>
        <p className="mb-4 text-muted-foreground">Temukan berbagai peluang usaha yang sesuai dengan minat Anda</p>
        <div className="mx-auto max-w-2xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
          <p className="text-xs text-amber-700">
            ⚠️ <strong>Perhatian:</strong> Selalu lakukan verifikasi dan berhati-hati sebelum melakukan transaksi
            bisnis. Segala kerjasama merupakan tanggung jawab masing-masing pihak.
          </p>
        </div>
      </div>

      {/* Search + Dropdown Toolbar */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama usaha, jenis usaha, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-card pl-12 pr-4 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:shrink-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <FilterDropdownTrigger
                icon={LayoutGrid}
                label={categoryDropdownLabel}
                active={selectedCategory !== "Semua"}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 w-56 overflow-y-auto">
              {availableCategories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center justify-between"
                >
                  <span>{category === "Semua" ? "Semua Kategori" : category}</span>
                  <div className="flex items-center gap-2">
                    {category !== "Semua" && businessCounts[category] != null && (
                      <span className="text-xs text-muted-foreground">{businessCounts[category]}</span>
                    )}
                    {selectedCategory === category && <Check className="h-4 w-4 text-primary" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <FilterDropdownTrigger
                icon={Filter}
                label={tierDropdownLabel}
                active={selectedTier !== CONNECT_SCORE_TIER_ALL}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 w-56 overflow-y-auto">
              <DropdownMenuItem
                onClick={() => setSelectedTier(CONNECT_SCORE_TIER_ALL)}
                className="flex items-center justify-between"
              >
                <span>Semua ConnectScore</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{tierCounts[CONNECT_SCORE_TIER_ALL]}</span>
                  {selectedTier === CONNECT_SCORE_TIER_ALL && <Check className="h-4 w-4 text-primary" />}
                </div>
              </DropdownMenuItem>
              {CONNECT_SCORE_TIERS.map((tier) => (
                <DropdownMenuItem
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className="flex items-center justify-between"
                >
                  <span>{tier.label}</span>
                  <div className="flex items-center gap-2">
                    {tierCounts[tier.id] != null && (
                      <span className="text-xs text-muted-foreground">{tierCounts[tier.id]}</span>
                    )}
                    {selectedTier === tier.id && <Check className="h-4 w-4 text-primary" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <FilterDropdownTrigger
                icon={ArrowUpDown}
                label={SORT_LABELS[sortBy]}
                active={sortBy !== "default"}
                variant="icon"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSortBy(option)}
                  className="flex items-center justify-between"
                >
                  <span>{SORT_LABELS[option]}</span>
                  {sortBy === option && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results + Reset */}
      <div className="mb-6 flex items-center justify-between gap-3">
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Semua")
              setSelectedTier(CONNECT_SCORE_TIER_ALL)
            }}
            className="text-sm font-medium text-primary hover:underline"
          >
            Reset filter
          </button>
        ) : (
          <span />
        )}
        <p className="text-sm text-muted-foreground">{filteredBusinesses.length} bisnis ditemukan</p>
      </div>

      {visibleBusinesses.length > 0 ? (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>

          {hasMore && (
            <div className="flex flex-col items-center gap-3 pb-8">
              <div ref={loadMoreRef} className="h-1 w-full" aria-hidden />
              <Button type="button" variant="outline" onClick={loadMore} className="bg-transparent">
                Muat lebih banyak
              </Button>
              <p className="text-xs text-muted-foreground">
                Menampilkan {visibleBusinesses.length} dari {filteredBusinesses.length} bisnis
              </p>
            </div>
          )}

          {!hasMore && filteredBusinesses.length > pageSize && (
            <p className="pb-8 text-center text-sm text-muted-foreground">
              Semua {filteredBusinesses.length} bisnis ditampilkan
            </p>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">Tidak ada hasil ditemukan</h3>
          <p className="text-muted-foreground">Coba ubah kata kunci pencarian atau filter kategori</p>
        </div>
      )}
    </div>
  )
}
