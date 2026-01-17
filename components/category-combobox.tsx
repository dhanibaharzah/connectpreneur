"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Check, ChevronsUpDown, Plus, Loader2, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Category {
  id: number
  name: string
  slug?: string
}

interface DeleteConfirmState {
  category: Category
  usageCount: number
  reassignTo: string
}

interface CategoryComboboxProps {
  value: string // category_id as string
  onChange: (value: string) => void
  allowCreate?: boolean // Only true for admin (also enables delete)
  apiEndpoint?: string // "/api/categories" or "/api/admin/categories"
  authHeaders?: HeadersInit
}

export default function CategoryCombobox({
  value,
  onChange,
  allowCreate = false,
  apiEndpoint = "/api/categories",
  authHeaders = {},
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [currentSearch, setCurrentSearch] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState | null>(null)
  
  const listRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const loadingRef = useRef(false)

  // Fetch categories
  const fetchCategories = useCallback(async (reset = false, searchTerm = "") => {
    if (loadingRef.current) return
    
    loadingRef.current = true
    setLoading(true)
    
    try {
      const currentOffset = reset ? 0 : offset
      const params = new URLSearchParams({
        limit: "10",
        offset: currentOffset.toString(),
        ...(searchTerm ? { search: searchTerm } : {}),
      })

      const res = await fetch(`${apiEndpoint}?${params}`, {
        credentials: "include",
        headers: authHeaders,
      })
      
      const data = await res.json()
      
      if (res.ok) {
        const newCategories = data.categories || []
        
        if (reset) {
          setCategories(newCategories)
          setOffset(newCategories.length)
        } else {
          // Prevent duplicates by filtering
          setCategories(prev => {
            const existingIds = new Set(prev.map(c => c.id))
            const uniqueNew = newCategories.filter((c: Category) => !existingIds.has(c.id))
            return [...prev, ...uniqueNew]
          })
          setOffset(currentOffset + newCategories.length)
        }
        setHasMore(data.hasMore || false)
        setCurrentSearch(searchTerm)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [apiEndpoint, authHeaders, offset])

  // Initial load
  useEffect(() => {
    fetchCategories(true, "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch selected category name if value is set
  useEffect(() => {
    if (value && !selectedCategory) {
      const found = categories.find(c => c.id.toString() === value)
      if (found) {
        setSelectedCategory(found)
      }
    }
  }, [value, categories, selectedCategory])

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setOffset(0)
      setHasMore(true)
      fetchCategories(true, search)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // Handle scroll for infinite loading
  const handleScroll = useCallback(() => {
    if (!listRef.current || loadingRef.current || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      fetchCategories(false, currentSearch)
    }
  }, [fetchCategories, hasMore, currentSearch])

  // Handle select
  const handleSelect = (category: Category) => {
    setSelectedCategory(category)
    onChange(category.id.toString())
    setOpen(false)
    setSearch("")
  }

  // Handle create new category
  const handleCreate = async () => {
    if (!search.trim() || !allowCreate) return

    setCreating(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ name: search.trim() }),
      })

      const data = await res.json()
      
      if (res.ok && data.category) {
        setCategories(prev => [data.category, ...prev])
        handleSelect(data.category)
      } else {
        alert(data.error || "Gagal membuat kategori")
      }
    } catch (error) {
      console.error("Error creating category:", error)
      alert("Terjadi kesalahan")
    } finally {
      setCreating(false)
    }
  }

  // Handle delete category - first check usage
  const handleDeleteClick = async (e: React.MouseEvent, category: Category) => {
    e.stopPropagation()
    if (!allowCreate) return

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        credentials: "include",
        headers: authHeaders,
      })
      const data = await res.json()
      
      if (res.ok) {
        setDeleteConfirm({
          category,
          usageCount: data.usageCount || 0,
          reassignTo: ""
        })
      }
    } catch (error) {
      console.error("Error checking category:", error)
    }
  }

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return

    setDeleting(true)
    try {
      let url = `/api/admin/categories/${deleteConfirm.category.id}`
      if (deleteConfirm.usageCount > 0 && deleteConfirm.reassignTo) {
        url += `?reassign_to=${deleteConfirm.reassignTo}`
      }

      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: authHeaders,
      })

      const data = await res.json()

      if (res.ok) {
        // Remove from list
        setCategories(prev => prev.filter(c => c.id !== deleteConfirm.category.id))
        
        // Clear selection if deleted category was selected
        if (value === deleteConfirm.category.id.toString()) {
          onChange("")
          setSelectedCategory(null)
        }
        
        setDeleteConfirm(null)
      } else {
        alert(data.error || "Gagal menghapus kategori")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Terjadi kesalahan")
    } finally {
      setDeleting(false)
    }
  }

  // Check if search matches existing category
  const exactMatch = categories.some(
    c => c.name.toLowerCase() === search.toLowerCase().trim()
  )

  // Get other categories for reassign dropdown
  const reassignOptions = categories.filter(c => c.id !== deleteConfirm?.category.id)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between font-normal"
        onClick={() => setOpen(!open)}
      >
        <span className={cn(!selectedCategory && "text-muted-foreground")}>
          {selectedCategory ? selectedCategory.name : "Pilih kategori..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <Input
              placeholder="Cari atau ketik kategori baru..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
              autoFocus
            />
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            className="max-h-60 overflow-y-auto"
            onScroll={handleScroll}
          >
            {/* Create new option */}
            {allowCreate && search.trim() && !exactMatch && (
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-accent text-primary border-b"
              >
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Buat kategori &quot;{search.trim()}&quot;</span>
              </button>
            )}

            {/* Category options */}
            {categories.length === 0 && !loading ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {search ? "Tidak ada kategori ditemukan" : "Belum ada kategori"}
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent group",
                    value === category.id.toString() && "bg-accent"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(category)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        value === category.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{category.name}</span>
                  </button>
                  {allowCreate && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteClick(e, category)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded text-destructive transition-opacity"
                      title="Hapus kategori"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Load more indicator */}
            {hasMore && !loading && categories.length > 0 && (
              <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                Scroll untuk muat lebih banyak...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Hapus Kategori</h3>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-muted-foreground mb-4">
              Apakah Anda yakin ingin menghapus kategori <strong>&quot;{deleteConfirm.category.name}&quot;</strong>?
            </p>

            {deleteConfirm.usageCount > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                  Kategori ini digunakan oleh <strong>{deleteConfirm.usageCount} bisnis</strong>. 
                  Pilih kategori pengganti:
                </p>
                <select
                  value={deleteConfirm.reassignTo}
                  onChange={(e) => setDeleteConfirm({ ...deleteConfirm, reassignTo: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                >
                  <option value="">-- Pilih kategori pengganti --</option>
                  {reassignOptions.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleting || (deleteConfirm.usageCount > 0 && !deleteConfirm.reassignTo)}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Hapus"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
