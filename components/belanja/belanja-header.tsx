"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Search, ShoppingBag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildBelanjaAkunPath } from "@/lib/marketplace/belanja-paths"
import { usePembeliAuth } from "@/components/pembeli/pembeli-auth-context"
import { PembeliLoginDialog } from "@/components/pembeli/pembeli-login-dialog"

interface BelanjaHeaderProps {
  homePath: string
  onSubdomain: boolean
  search?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: () => void
}

function BelanjaHeaderAuth({ onSubdomain }: { onSubdomain: boolean }) {
  const { user, loading } = usePembeliAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const akunPath = buildBelanjaAkunPath(onSubdomain)

  if (loading) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center sm:w-20 sm:justify-end">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-10 shrink-0 p-0 sm:h-9 sm:w-auto sm:px-3 sm:gap-1.5"
          onClick={() => setLoginOpen(true)}
          aria-label="Masuk"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Masuk</span>
        </Button>
        <PembeliLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </>
    )
  }

  const label = user.displayName?.split(" ")[0] || "Akun"

  return (
    <Button
      variant="outline"
      className="h-10 w-10 shrink-0 p-0 sm:h-9 sm:w-auto sm:px-3 sm:gap-1.5"
      asChild
    >
      <Link href={akunPath} aria-label={label}>
        <User className="h-4 w-4" />
        <span className="hidden max-w-[100px] truncate sm:inline">{label}</span>
      </Link>
    </Button>
  )
}

export function BelanjaHeader({
  homePath,
  onSubdomain,
  search = "",
  onSearchChange,
  onSearchSubmit,
}: BelanjaHeaderProps) {
  const router = useRouter()
  const [localSearch, setLocalSearch] = useState("")
  const isControlled = onSearchChange != null
  const searchValue = isControlled ? search : localSearch

  const handleSearchSubmit = () => {
    if (isControlled) {
      onSearchSubmit?.()
      return
    }

    const query = localSearch.trim()
    if (!query) {
      router.push(homePath)
      return
    }

    const params = new URLSearchParams({ search: query })
    router.push(`${homePath}?${params.toString()}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={homePath} className="flex shrink-0 items-center gap-2">
            <Image
              src="/images/logoconnectpreneur.png"
              alt="ConnectPreneur"
              width={120}
              height={36}
              className="h-8 w-auto sm:h-9"
            />
          </Link>
          <div className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="font-medium">Belanja</span>
          </div>
          <form
            className="relative min-w-0 flex-1"
            onSubmit={(e) => {
              e.preventDefault()
              handleSearchSubmit()
            }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) =>
                isControlled ? onSearchChange(e.target.value) : setLocalSearch(e.target.value)
              }
              placeholder="Cari produk atau jasa..."
              className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
          <BelanjaHeaderAuth onSubdomain={onSubdomain} />
        </div>
      </div>
    </header>
  )
}
