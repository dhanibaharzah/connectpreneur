"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  businessCounts?: Record<string, number>
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  businessCounts = {}
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter categories based on search
  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get count for display
  const getCount = (category: string) => {
    if (category === "Semua") return null
    return businessCounts[category] || 0
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mobile: Dropdown */}
      <div className="w-full max-w-md">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-card border border-border rounded-xl shadow-sm hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">
                {selectedCategory === "Semua" ? "Semua Kategori" : selectedCategory}
              </span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )} />
          </button>

          {/* Dropdown Panel */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown Content */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-80 overflow-hidden">
                {/* Search in dropdown */}
                {categories.length > 6 && (
                  <div className="p-3 border-b border-border">
                    <input
                      type="text"
                      placeholder="Cari kategori..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none"
                      autoFocus
                    />
                  </div>
                )}
                
                {/* Category List */}
                <div className="overflow-y-auto max-h-60">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          onCategoryChange(category)
                          setIsOpen(false)
                          setSearchQuery("")
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 text-left transition-colors",
                          selectedCategory === category 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center gap-2">
                          {getCount(category) !== null && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              {getCount(category)}
                            </span>
                          )}
                          {selectedCategory === category && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                      Kategori tidak ditemukan
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Filter Chips - Show only first 5 categories for quick access */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.slice(0, 6).map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
              selectedCategory === category
                ? "bg-primary text-white shadow-md"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {category}
            {getCount(category) !== null && (
              <span className="ml-1 opacity-70">({getCount(category)})</span>
            )}
          </button>
        ))}
        {categories.length > 6 && selectedCategory !== "Semua" && !categories.slice(0, 6).includes(selectedCategory) && (
          <button
            onClick={() => onCategoryChange(selectedCategory)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-white shadow-md flex items-center gap-1"
          >
            {selectedCategory}
            <X 
              className="h-3 w-3 hover:bg-white/20 rounded-full" 
              onClick={(e) => {
                e.stopPropagation()
                onCategoryChange("Semua")
              }}
            />
          </button>
        )}
      </div>
    </div>
  )
}
