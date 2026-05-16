import { BusinessCard } from "@/components/business-card"
import { CatalogCtaLink } from "@/components/analytics/catalog-cta-link"
import { getFeaturedBusinesses } from "@/lib/db"
import { unstable_noStore as noStore } from "next/cache"

function CatalogBottomWave() {
  return (
    <div
      className="relative -mt-10 h-32 w-full shrink-0 translate-y-px md:-mt-14 md:h-40"
      aria-hidden
    >
      <svg
        className="absolute inset-0 block h-full w-full text-white"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Full-width fill: wavy top edge only (no flat segment); bottom is straight under next section */}
        <path
          fill="currentColor"
          d="M0 140V70C280 22 520 112 720 52C960 4 1200 102 1440 46V140H0z"
        />
      </svg>
    </div>
  )
}

export async function CatalogSection() {
  noStore()
  const displayedBusinesses = await getFeaturedBusinesses(4)

  return (
    <section
      id="katalog"
      className="relative overflow-x-clip bg-gradient-to-b from-white from-[36%] to-[#fdede8] pb-0 pt-14 md:pt-[60px]"
    >
      <div className="container mx-auto max-w-6xl space-y-8 px-4 pb-16 md:px-8 md:pb-20 lg:px-[60px]">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#1f1f1f] md:text-[32px]">Katalog Bisnis Kemitraan</h2>
          <p className="text-sm text-[#838383] md:text-base">
            Temukan berbagai peluang usaha yang sesuai dengan minat Anda
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayedBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <CatalogCtaLink className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-gradient-to-b from-[#ec4e14] to-[#bd3e10] px-8 text-sm font-medium text-white shadow-sm transition hover:opacity-95">
            Lihat Semua Katalog
          </CatalogCtaLink>
        </div>
      </div>
      {/* Full-bleed wave — section padding used to shrink the SVG and left straight peach strips */}
      <div className="relative left-1/2 z-[1] w-screen -translate-x-1/2">
        <CatalogBottomWave />
      </div>
    </section>
  )
}
