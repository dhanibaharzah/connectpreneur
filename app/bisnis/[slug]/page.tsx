import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BusinessDetailContent } from "@/components/business/business-detail-content"
import { BusinessPageTracker } from "@/components/analytics/business-page-tracker"
import { getBusinessBySlug } from "@/lib/catalog/read-model"
import { getKatalogPathsFromHeaders } from "@/lib/catalog/catalog-paths"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

// This ensures pages are always rendered on-demand with fresh data

export default async function BusinessDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [business, paths] = await Promise.all([getBusinessBySlug(slug), getKatalogPathsFromHeaders()])

  if (!business) {
    notFound()
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-background">
      <Header useMainSiteLinks={paths.onSubdomain} />
      <main className="relative z-0 flex-1 py-8 md:py-12">
        <BusinessPageTracker businessId={business.id} />
        <BusinessDetailContent business={business} />
      </main>
      <Footer useMainSiteLinks={paths.onSubdomain} />
    </div>
  )
}
