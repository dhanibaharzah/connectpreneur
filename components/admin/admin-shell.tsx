"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Building2, Users, LogOut, Receipt, ImageIcon } from "lucide-react"
import { cn } from "@/lib/shared/utils"
import { getAdminPath, getLoginPath, getDashboardPath, getMitraPath, getMembersPath, getTransaksiPath, getBannerPath } from "@/lib/admin/navigation"
import type { AdminUser } from "@/lib/auth"

export type { AdminUser }

interface AdminShellProps {
  user: AdminUser
  children: React.ReactNode
}

function getNavItems(userRole: string) {
  const items = [
    { href: getDashboardPath(), label: "Dashboard", icon: LayoutDashboard, match: "/dashboard" },
    { href: getMitraPath(), label: "Mitra Bisnis", icon: Building2, match: "/mitra" },
    { href: getTransaksiPath(), label: "Transaksi", icon: Receipt, match: "/transaksi" },
  ]
  if (userRole === "superadmin") {
    items.push(
      { href: getBannerPath(), label: "Banner Belanja", icon: ImageIcon, match: "/banner" },
      { href: getMembersPath(), label: "Anggota", icon: Users, match: "/members" },
    )
  }
  return items
}

function getCSRFToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/)
  return match ? match[1] : null
}

export function getAdminAuthHeaders(options?: { includeContentType?: boolean }): HeadersInit {
  const includeContentType = options?.includeContentType !== false
  const csrfToken = getCSRFToken()
  return {
    ...(includeContentType ? { "Content-Type": "application/json" } : {}),
    ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
  }
}

export default function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: getAdminAuthHeaders(),
    })
    router.push(getLoginPath())
  }

  const isActive = (match: string) => {
    const normalized = pathname.replace(/^\/admin/, "") || "/"
    if (match === "/dashboard") {
      return normalized === "/dashboard" || normalized === "/" || normalized === ""
    }
    return normalized.startsWith(match)
  }

  const navItems = getNavItems(user.role)

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image
              src="/images/logoconnectpreneur.png"
              alt="ConnectPreneur"
              width={120}
              height={48}
              className="h-10 w-auto"
            />
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.match)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline">{user.email}</span>
            <Badge variant="outline">{user.role}</Badge>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <nav className="sm:hidden bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.match)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap shrink-0",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}