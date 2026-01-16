import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { IntroSection } from "@/components/intro-section"
import { CatalogSection } from "@/components/catalog-section"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroSection />

        <CatalogSection />

        <IntroSection />

        <AboutSection />
      </main>

      <Footer />
    </div>
  )
}
