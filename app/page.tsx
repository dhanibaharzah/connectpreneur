import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/marketing/hero-section"
import { CatalogSection } from "@/components/katalog/catalog-section"
import { HaloSobatBanner } from "@/components/home/halo-sobat-banner"
import { BusinessMatchingSection } from "@/components/home/business-matching-section"
import { ExpandBusinessCta } from "@/components/home/expand-business-cta"
import { AboutSection } from "@/components/marketing/about-section"
import { ConnectpreneurBanner } from "@/components/home/connectpreneur-banner"
import { Footer } from "@/components/layout/footer"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Home() {
  return (
    <div className="relative isolate min-h-screen bg-background">
      <Header variant="hero" />

      <main className="relative z-0">
        <HeroSection />
        <CatalogSection />
        <HaloSobatBanner />
        <BusinessMatchingSection />
        <ExpandBusinessCta />
        <AboutSection />
        <ConnectpreneurBanner />
      </main>

      <Footer />
    </div>
  )
}
