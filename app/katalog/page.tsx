import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAllBusinesses, getAllCategories } from "@/lib/db"
import { KatalogClient } from "@/components/katalog-client"
import { KatalogPageTracker } from "@/components/analytics/katalog-page-tracker"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function KatalogPage() {
  const [businesses, categories] = await Promise.all([getAllBusinesses(), getAllCategories()])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <KatalogPageTracker />
        <KatalogClient businesses={businesses} categories={categories} />
      </main>
      <Footer />
    </div>
  )
}
