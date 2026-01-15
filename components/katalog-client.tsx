"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { CategoryFilter } from "@/components/category-filter"
import { BusinessCard } from "@/components/business-card"
import { Button } from "@/components/ui/button"
import type { Business } from "@/types/business"

const ITEMS_PER_PAGE = 10

interface KatalogClientProps {
  businesses: Business[]
  categories: string[]
}

export function KatalogClient({ businesses, categories }: KatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearch =
        business.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.kotaProvinsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.jenisUsaha.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "Semua" || business.jenisUsaha === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [businesses, searchQuery, selectedCategory])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Katalog Bisnis Kemitraan</h1>
        <p className="text-muted-foreground">Temukan berbagai peluang usaha yang sesuai dengan minat Anda</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama usaha, jenis usaha, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl text-foreground bg-card shadow-md border border-border focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Results Count */}
      <div className="mb-6 text-center">
        <p className="text-muted-foreground">
          Menampilkan {paginatedBusinesses.length} dari {filteredBusinesses.length} bisnis
        </p>
      </div>

      {/* Business Cards Grid */}
      {paginatedBusinesses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {paginatedBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-border"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? "bg-primary text-white" : "border-border"}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-border"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Tidak ada hasil ditemukan</h3>
          <p className="text-muted-foreground">Coba ubah kata kunci pencarian atau filter kategori</p>
        </div>
      )}
    </div>
  )
}
