"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin/admin-dashboard"
import { Loader2 } from "lucide-react"
import { getLoginPath } from "@/lib/use-admin-navigation"

interface AdminUser {
  id: number
  email: string
  name: string | null
  role: string
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        // Try to get user from API (checks cookie)
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
          // Not authenticated, redirect to login
          router.push(getLoginPath())
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push(getLoginPath())
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <AdminDashboard user={user} />
}
