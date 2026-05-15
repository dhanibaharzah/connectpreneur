"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getDashboardPath } from "@/lib/use-admin-navigation"

export default function AdminRootPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(getDashboardPath())
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
