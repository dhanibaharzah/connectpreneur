"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { History, ShoppingBag } from "lucide-react"
import {
  buildBelanjaAkunPath,
  buildBelanjaAkunPoinPath,
} from "@/lib/marketplace/belanja-paths"
import { cn } from "@/lib/shared/utils"

interface PembeliAccountNavProps {
  onSubdomain: boolean
}

export function PembeliAccountNav({ onSubdomain }: PembeliAccountNavProps) {
  const pathname = usePathname()
  const transaksiPath = buildBelanjaAkunPath(onSubdomain)
  const poinPath = buildBelanjaAkunPoinPath(onSubdomain)
  const isPoin = pathname === poinPath || pathname.endsWith("/akun/poin")

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px",
      active
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground",
    )

  return (
    <nav className="mb-6 flex gap-1 border-b">
      <Link href={transaksiPath} className={linkClass(!isPoin)}>
        <ShoppingBag className="h-4 w-4" />
        Transaksi
      </Link>
      <Link href={poinPath} className={linkClass(isPoin)}>
        <History className="h-4 w-4" />
        Riwayat Poin
      </Link>
    </nav>
  )
}
