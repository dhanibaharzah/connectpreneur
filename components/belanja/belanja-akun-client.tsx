"use client"

import { BelanjaHeader } from "@/components/belanja/belanja-header"
import { PembeliLoginForm } from "@/components/pembeli/pembeli-login-form"
import { PembeliAccountDashboard } from "@/components/pembeli/pembeli-account-dashboard"
import { PembeliAuthProvider, usePembeliAuth } from "@/components/pembeli/pembeli-auth-context"
import { Loader2 } from "lucide-react"

interface BelanjaAkunClientProps {
  homePath: string
  onSubdomain: boolean
}

function BelanjaAkunContent({ homePath, onSubdomain }: BelanjaAkunClientProps) {
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
          <PembeliAccountDashboard />
        ) : (
          <PembeliLoginForm variant="card" />
        )}
      </main>
    </div>
  )
}

export function BelanjaAkunClient(props: BelanjaAkunClientProps) {
  return (
    <PembeliAuthProvider>
      <BelanjaAkunContent {...props} />
    </PembeliAuthProvider>
  )
}
