"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/shared/utils"

interface Location {
  id: number
  name: string
}

interface SearchableSelectProps {
  id: string
  items: Location[]
  value: number | null
  onChange: (value: number | null) => void
  placeholder: string
  searchPlaceholder: string
  disabled?: boolean
  loading?: boolean
  error?: string
}

function SearchableSelect({
  id,
  items,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled = false,
  loading = false,
  error,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedItem = items.find((item) => item.id === value)

  // Filter items based on search
  const filteredItems = search.trim()
    ? items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase().trim())
      )
    : items

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleSelect = useCallback(
    (item: Location) => {
      onChange(item.id)
      setOpen(false)
      setSearch("")
    },
    [onChange]
  )

  const handleToggle = () => {
    if (disabled || loading) return
    setOpen(!open)
    if (!open) {
      setSearch("")
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        onClick={handleToggle}
        disabled={disabled || loading}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500"
        )}
      >
        <span className={cn(!selectedItem && "text-muted-foreground")}>
          {loading ? "Memuat..." : selectedItem ? selectedItem.name : placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <Input
              ref={inputRef}
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {search ? "Tidak ditemukan" : "Tidak ada data"}
              </div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-accent",
                    value === item.id && "bg-accent"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{item.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface LocationDropdownProps {
  // Callback when location is selected (returns kecamatan id)
  onLocationChange?: (locationId: number | null, locationName: string) => void
  // Initial values (for edit mode)
  initialKabKotaId?: number
  initialKecamatanId?: number
  // Admin location scope (restricts dropdown options)
  // null/undefined = no restriction (superadmin or public)
  scopeLocationId?: number | null
  // Labels
  kabKotaLabel?: string
  kecamatanLabel?: string
  // Disabled state
  disabled?: boolean
  // Required fields
  required?: boolean
  // Error states
  kabKotaError?: string
  kecamatanError?: string
}

export function LocationDropdown({
  onLocationChange,
  initialKabKotaId,
  initialKecamatanId,
  scopeLocationId,
  kabKotaLabel = "Kabupaten/Kota",
  kecamatanLabel = "Kecamatan",
  disabled = false,
  required = false,
  kabKotaError,
  kecamatanError,
}: LocationDropdownProps) {
  const [kabKotaList, setKabKotaList] = useState<Location[]>([])
  const [kecamatanList, setKecamatanList] = useState<Location[]>([])
  const [selectedKabKota, setSelectedKabKota] = useState<number | null>(initialKabKotaId || null)
  const [selectedKecamatan, setSelectedKecamatan] = useState<number | null>(initialKecamatanId || null)
  const [loadingKabKota, setLoadingKabKota] = useState(true)
  const [loadingKecamatan, setLoadingKecamatan] = useState(false)

  // Scope state: resolved from scopeLocationId
  const [scopeLevel, setScopeLevel] = useState<string | null>(null) // "kabupaten_kota" | "kecamatan" | null
  const [scopeKabKotaId, setScopeKabKotaId] = useState<number | null>(null)
  const [scopeKecamatanId, setScopeKecamatanId] = useState<number | null>(null)
  const [scopeResolved, setScopeResolved] = useState(!scopeLocationId) // true if no scope or already resolved

  // Resolve scope location details
  useEffect(() => {
    async function resolveScope() {
      if (!scopeLocationId) {
        setScopeResolved(true)
        return
      }

      try {
        const res = await fetch(`/api/locations/detail/${scopeLocationId}`)
        if (res.ok) {
          const data = await res.json()
          setScopeLevel(data.level)

          if (data.level === "kabupaten_kota") {
            // Admin scoped to a kab/kota: lock kab/kota, show all kecamatans under it
            setScopeKabKotaId(data.id)
            setSelectedKabKota(data.id)
          } else if (data.level === "kecamatan") {
            // Admin scoped to a kecamatan: lock both dropdowns
            setScopeKecamatanId(data.id)
            setScopeKabKotaId(data.parent_id)
            setSelectedKabKota(data.parent_id)
            setSelectedKecamatan(data.id)
          }
        }
      } catch (error) {
        console.error("Error resolving scope location:", error)
      } finally {
        setScopeResolved(true)
      }
    }
    resolveScope()
  }, [scopeLocationId])

  // Load kabupaten/kota on mount (after scope is resolved)
  useEffect(() => {
    if (!scopeResolved) return

    async function fetchKabKota() {
      try {
        setLoadingKabKota(true)
        const res = await fetch("/api/locations")
        if (res.ok) {
          let data: Location[] = await res.json()

          // If scoped to kab/kota or kecamatan, filter to only the allowed kab/kota
          if (scopeKabKotaId) {
            data = data.filter((loc) => loc.id === scopeKabKotaId)
          }

          setKabKotaList(data)

          // Auto-select if only one option (scoped)
          if (scopeKabKotaId && data.length === 1) {
            setSelectedKabKota(data[0].id)
          }
        }
      } catch (error) {
        console.error("Error fetching kabupaten/kota:", error)
      } finally {
        setLoadingKabKota(false)
      }
    }
    fetchKabKota()
  }, [scopeResolved, scopeKabKotaId])

  // Resolve parent kabupaten/kota from initialKecamatanId
  useEffect(() => {
    async function resolveParent() {
      if (!initialKecamatanId || scopeKabKotaId) return
      
      try {
        const res = await fetch(`/api/locations/detail/${initialKecamatanId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.parent_id) {
            setSelectedKabKota(data.parent_id)
          }
        }
      } catch (error) {
        console.error("Error resolving parent location:", error)
      }
    }
    resolveParent()
  }, [initialKecamatanId, scopeKabKotaId])

  // Load kecamatan when kabupaten/kota changes
  useEffect(() => {
    async function fetchKecamatan() {
      if (!selectedKabKota) {
        setKecamatanList([])
        return
      }

      try {
        setLoadingKecamatan(true)
        const res = await fetch(`/api/locations/${selectedKabKota}`)
        if (res.ok) {
          let data: Location[] = await res.json()

          // If scoped to a specific kecamatan, filter to only that one
          if (scopeKecamatanId) {
            data = data.filter((loc) => loc.id === scopeKecamatanId)
          }

          setKecamatanList(data)

          // Auto-select if scoped to single kecamatan
          if (scopeKecamatanId && data.length === 1) {
            setSelectedKecamatan(data[0].id)
            // Trigger callback
            const kabKota = kabKotaList.find((k) => k.id === selectedKabKota)
            const fullName = `${data[0].name}, ${kabKota?.name || ""}, Jawa Barat`
            onLocationChange?.(data[0].id, fullName)
          }
        }
      } catch (error) {
        console.error("Error fetching kecamatan:", error)
      } finally {
        setLoadingKecamatan(false)
      }
    }
    fetchKecamatan()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKabKota, scopeKecamatanId])

  // Load initial kecamatan if initialKabKotaId is provided
  useEffect(() => {
    if (initialKabKotaId && !scopeKabKotaId) {
      setSelectedKabKota(initialKabKotaId)
    }
  }, [initialKabKotaId, scopeKabKotaId])

  // Set initial kecamatan after list is loaded
  useEffect(() => {
    if (initialKecamatanId && kecamatanList.length > 0 && !scopeKecamatanId) {
      setSelectedKecamatan(initialKecamatanId)
    }
  }, [initialKecamatanId, kecamatanList, scopeKecamatanId])

  // Handle kabupaten/kota selection
  const handleKabKotaChange = (value: number | null) => {
    setSelectedKabKota(value)
    setSelectedKecamatan(null) // Reset kecamatan
    onLocationChange?.(null, "")
  }

  // Handle kecamatan selection
  const handleKecamatanChange = (value: number | null) => {
    setSelectedKecamatan(value)
    
    if (value) {
      const kecamatan = kecamatanList.find((k) => k.id === value)
      const kabKota = kabKotaList.find((k) => k.id === selectedKabKota)
      const fullName = kecamatan && kabKota 
        ? `${kecamatan.name}, ${kabKota.name}, Jawa Barat`
        : ""
      onLocationChange?.(value, fullName)
    } else {
      onLocationChange?.(null, "")
    }
  }

  // Determine if dropdowns should be locked
  const isKabKotaLocked = !!scopeKabKotaId
  const isKecamatanLocked = !!scopeKecamatanId

  return (
    <div className="grid gap-4">
      {/* Kabupaten/Kota Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="kabKota">
          {kabKotaLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <SearchableSelect
          id="kabKota"
          items={kabKotaList}
          value={selectedKabKota}
          onChange={handleKabKotaChange}
          placeholder="Pilih Kabupaten/Kota"
          searchPlaceholder="Cari kabupaten/kota..."
          disabled={disabled || isKabKotaLocked}
          loading={loadingKabKota || !scopeResolved}
          error={kabKotaError}
        />
        {kabKotaError && (
          <p className="text-sm text-red-500">{kabKotaError}</p>
        )}
      </div>

      {/* Kecamatan Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="kecamatan">
          {kecamatanLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <SearchableSelect
          id="kecamatan"
          items={kecamatanList}
          value={selectedKecamatan}
          onChange={handleKecamatanChange}
          placeholder={
            !selectedKabKota
              ? "Pilih kabupaten/kota terlebih dahulu"
              : "Pilih Kecamatan"
          }
          searchPlaceholder="Cari kecamatan..."
          disabled={disabled || !selectedKabKota || isKecamatanLocked}
          loading={loadingKecamatan}
          error={kecamatanError}
        />
        {kecamatanError && (
          <p className="text-sm text-red-500">{kecamatanError}</p>
        )}
      </div>
    </div>
  )
}
