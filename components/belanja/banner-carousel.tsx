"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/shared/utils"
import { isDisplayableImageUrl } from "@/lib/integrations/storage-urls"
import type { ShopBanner } from "@/types/shop-banner"

interface BannerCarouselProps {
  banners: ShopBanner[]
  className?: string
}

export function BannerCarousel({ banners, className }: BannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: banners.length > 1 })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || banners.length <= 1) return

    const timer = window.setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    return () => window.clearInterval(timer)
  }, [emblaApi, banners.length])

  if (banners.length === 0) return null

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => {
            const content = (
              <div className="relative aspect-[21/7] min-w-0 flex-[0_0_100%] overflow-hidden rounded-xl bg-muted sm:aspect-[21/6]">
                {isDisplayableImageUrl(banner.imageUrl) ? (
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title || "Banner promosi"}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={banner.id === banners[0]?.id}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Banner
                  </div>
                )}
              </div>
            )

            if (banner.linkUrl) {
              const isExternal = banner.linkUrl.startsWith("http")
              if (isExternal) {
                return (
                  <a
                    key={banner.id}
                    href={banner.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block min-w-0 flex-[0_0_100%]"
                  >
                    {content}
                  </a>
                )
              }
              return (
                <Link key={banner.id} href={banner.linkUrl} className="block min-w-0 flex-[0_0_100%]">
                  {content}
                </Link>
              )
            }

            return (
              <div key={banner.id} className="min-w-0 flex-[0_0_100%]">
                {content}
              </div>
            )
          })}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full opacity-90 shadow"
            onClick={scrollPrev}
            aria-label="Banner sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full opacity-90 shadow"
            onClick={scrollNext}
            aria-label="Banner berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="mt-3 flex justify-center gap-1.5">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Banner ${index + 1}`}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === selectedIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
