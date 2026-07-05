"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BookOpen, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GuideScreenshot } from "@/components/panduan/guide-screenshot"
import {
  PANDUAN_GUIDES,
  isPanduanSection,
  type PanduanSection,
} from "@/lib/panduan/guides"
import { belanjaPortalUrl, katalogPortalUrl, mitraPortalUrl } from "@/lib/shared/app-url"
import { cn } from "@/lib/shared/utils"

interface PanduanClientProps {
  initialSection?: string
}

function getSectionCta(section: PanduanSection): { label: string; href: string } {
  switch (section) {
    case "buyer":
      return { label: "Buka Belanja", href: belanjaPortalUrl("/") }
    case "mitra":
      return { label: "Portal Mitra", href: mitraPortalUrl("/") }
    case "katalog":
      return { label: "Lihat Katalog", href: katalogPortalUrl("/") }
    case "belanja":
      return { label: "Mulai Belanja", href: belanjaPortalUrl("/") }
  }
}

export function PanduanClient({ initialSection }: PanduanClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sectionParam = searchParams.get("section")
  const activeSection: PanduanSection = isPanduanSection(sectionParam)
    ? sectionParam
    : isPanduanSection(initialSection)
      ? initialSection
      : "buyer"

  const handleTabChange = (value: string) => {
    if (!isPanduanSection(value)) return
    router.replace(`/panduan?section=${value}`, { scroll: false })
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8 space-y-3 text-center md:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <BookOpen className="h-4 w-4" />
          Panduan Pengguna
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Baru di ConnectPreneur?
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Pilih panduan sesuai peran Anda. Setiap langkah dilengkapi screenshot agar mudah diikuti —
          mulai dari browsing katalog hingga transaksi di marketplace Belanja.
        </p>
      </div>

      <Tabs value={activeSection} onValueChange={handleTabChange} className="gap-8">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="inline-flex h-auto w-max min-w-full gap-1 p-1 sm:grid sm:w-full sm:grid-cols-4">
            {PANDUAN_GUIDES.map((guide) => (
              <TabsTrigger
                key={guide.id}
                value={guide.id}
                className="min-w-[5.5rem] shrink-0 flex-none px-4 py-2.5 text-sm sm:min-w-0 sm:flex-1 sm:px-2"
              >
                {guide.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {PANDUAN_GUIDES.map((guide) => {
          const cta = getSectionCta(guide.id)

          return (
            <TabsContent key={guide.id} value={guide.id} className="mt-0 space-y-8">
              <div className="rounded-2xl border bg-card p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground">{guide.headline}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{guide.intro}</p>
                <Link
                  href={cta.href}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  {cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <ol className="space-y-10">
                {guide.steps.map((step, index) => (
                  <li key={step.title} className="relative scroll-mt-28">
                    <div className="flex gap-4 md:gap-6">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground",
                          "md:h-10 md:w-10 md:text-base",
                        )}
                        aria-hidden
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground md:text-xl">
                            {step.title}
                          </h3>
                          <p className="mt-2 text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                          {step.tips && step.tips.length > 0 && (
                            <ul className="mt-3 space-y-1.5 rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                              {step.tips.map((tip) => (
                                <li key={tip} className="flex gap-2">
                                  <span className="text-primary" aria-hidden>
                                    •
                                  </span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <GuideScreenshot src={step.screenshotPath} alt={step.screenshotAlt} />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
