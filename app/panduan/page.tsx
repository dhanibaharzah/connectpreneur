import type { Metadata } from "next"
import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PanduanClient } from "@/components/panduan/panduan-client"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Panduan Pengguna | ConnectPreneur",
  description:
    "Panduan lengkap ConnectPreneur untuk pembeli, mitra UMKM, pengunjung katalog, dan marketplace Belanja.",
}

function PanduanFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export default async function PanduanPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>
}) {
  const { section } = await searchParams

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-background">
      <Header />
      <main className="relative z-0 flex-1">
        <Suspense fallback={<PanduanFallback />}>
          <PanduanClient initialSection={section} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
