import { ArrowRight } from "lucide-react"
import { BusinessCard } from "@/components/business-card"
import { CatalogCtaLink } from "@/components/analytics/catalog-cta-link"
import { getFeaturedBusinesses } from "@/lib/db"
import { unstable_noStore as noStore } from "next/cache"

export async function CatalogSection() {
  noStore() // Disable caching for this component
  const displayedBusinesses = await getFeaturedBusinesses(4)

  return (
    <section id="katalog" className="py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Katalog Bisnis Kemitraan</h2>
          <p className="text-muted-foreground">Temukan berbagai peluang usaha yang sesuai dengan minat Anda</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {displayedBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>

        <div className="text-center">
          <CatalogCtaLink className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Lihat Semua Katalog
            <ArrowRight className="h-5 w-5" />
          </CatalogCtaLink>
        </div>
      </div>
    </section>
  )
}
