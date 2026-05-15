import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BusinessDetailContent } from "@/components/business-detail-content"
import { BusinessPageTracker } from "@/components/analytics/business-page-tracker"
import { getBusinessBySlug } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

// This ensures pages are always rendered on-demand with fresh data

export default async function BusinessDetailPage({ params }: PageProps) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <BusinessPageTracker businessId={business.id} />
        <BusinessDetailContent business={business} />
      </main>
      <Footer />
    </div>
  )
}
