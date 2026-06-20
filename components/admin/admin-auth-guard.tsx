"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getLoginPath } from "@/lib/admin/navigation"
import type { AdminUser } from "./admin-shell"

export function useAdminAuth() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          router.push(getLoginPath())
        }
      } catch {
        router.push(getLoginPath())
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  return { user, loading }
}

export function AdminAuthGuard({ children }: { children: (user: AdminUser) => ReactNode }) {
  const { user, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return <>{children(user)}</>
}
