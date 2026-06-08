import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CatalogSection } from "@/components/catalog-section"
import { HaloSobatBanner } from "@/components/home/halo-sobat-banner"
import { BusinessMatchingSection } from "@/components/home/business-matching-section"
import { ExpandBusinessCta } from "@/components/home/expand-business-cta"
import { AboutSection } from "@/components/about-section"
import { ConnectpreneurBanner } from "@/components/home/connectpreneur-banner"
import { Footer } from "@/components/footer"

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
