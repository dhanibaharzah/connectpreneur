"use client"

import { BelanjaFooter } from "@/components/belanja/belanja-footer"
import { BelanjaHeader } from "@/components/belanja/belanja-header"
import { PembeliAccountNav } from "@/components/pembeli/pembeli-account-nav"
import { PembeliLoginForm } from "@/components/pembeli/pembeli-login-form"
import { usePembeliAuth } from "@/components/pembeli/pembeli-auth-context"
import { Loader2 } from "lucide-react"

interface BelanjaAkunLayoutProps {
  homePath: string
  onSubdomain: boolean
  children: React.ReactNode
}

export function BelanjaAkunLayout({ homePath, onSubdomain, children }: BelanjaAkunLayoutProps) {
  const { user, loading } = usePembeliAuth()

  return (
    <div className="min-h-screen bg-muted/20">
      <BelanjaHeader homePath={homePath} onSubdomain={onSubdomain} />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : user ? (
          <>
            <PembeliAccountNav onSubdomain={onSubdomain} />
            {children}
          </>
        ) : (
          <PembeliLoginForm variant="card" />
        )}
      </main>
      <BelanjaFooter homePath={homePath} onSubdomain={onSubdomain} />
    </div>
  )
}
