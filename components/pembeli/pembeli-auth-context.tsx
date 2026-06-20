"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { BuyerBadgeLevel } from "@/types/gamification"

export interface PembeliUser {
  phone: string
  displayName: string | null
  totalPoints: number
  badgeLevel: BuyerBadgeLevel
  completedOrders: number
}

interface PembeliAuthContextValue {
  user: PembeliUser | null
  loading: boolean
  refreshSession: () => Promise<PembeliUser | null>
  logout: () => Promise<void>
}

const PembeliAuthContext = createContext<PembeliAuthContextValue | null>(null)

export function PembeliAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PembeliUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/pembeli/me", { credentials: "include" })
      if (res.status === 401) {
        setUser(null)
        return null
      }
      if (!res.ok) {
        setUser(null)
        return null
      }
      const data = await res.json()
      const nextUser: PembeliUser = {
        phone: data.phone,
        displayName: data.displayName ?? null,
        totalPoints: data.totalPoints ?? 0,
        badgeLevel: data.badgeLevel ?? "new",
        completedOrders: data.completedOrders ?? 0,
      }
      setUser(nextUser)
      return nextUser
    } catch {
      setUser(null)
      return null
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch("/api/pembeli/logout", { method: "POST", credentials: "include" })
    setUser(null)
  }, [])

  useEffect(() => {
    refreshSession().finally(() => setLoading(false))
  }, [refreshSession])

  const value = useMemo(
    () => ({ user, loading, refreshSession, logout }),
    [user, loading, refreshSession, logout],
  )

  return <PembeliAuthContext.Provider value={value}>{children}</PembeliAuthContext.Provider>
}

export function usePembeliAuth(): PembeliAuthContextValue {
  const ctx = useContext(PembeliAuthContext)
  if (!ctx) {
    throw new Error("usePembeliAuth must be used within PembeliAuthProvider")
  }
  return ctx
}

export function useOptionalPembeliAuth(): PembeliAuthContextValue | null {
  return useContext(PembeliAuthContext)
}
