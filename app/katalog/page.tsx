import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getAllBusinesses, getAllCategories } from "@/lib/catalog/read-model"
import { getKatalogPathsFromHeaders } from "@/lib/catalog/catalog-paths"
import { KatalogClient } from "@/components/katalog/katalog-client"
import { KatalogPageTracker } from "@/components/analytics/katalog-page-tracker"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function KatalogPage() {
  const [businesses, categories, paths] = await Promise.all([
    getAllBusinesses(),
    getAllCategories(),
    getKatalogPathsFromHeaders(),
  ])

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-background">
      <Header useMainSiteLinks={paths.onSubdomain} />
      <main className="relative z-0 flex-1 py-8 md:py-12">
        <KatalogPageTracker />
        <KatalogClient businesses={businesses} categories={categories} />
      </main>
      <Footer useMainSiteLinks={paths.onSubdomain} />
    </div>
  )
}
