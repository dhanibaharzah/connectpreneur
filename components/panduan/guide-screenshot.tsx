"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/shared/utils"

interface GuideScreenshotProps {
  src: string
  alt: string
  className?: string
}

export function GuideScreenshot({ src, alt, className }: GuideScreenshotProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-6 py-10 text-center",
          className,
        )}
      >
        <ImageIcon className="h-10 w-10 text-muted-foreground/50" aria-hidden />
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{alt}</p>
          <p className="font-mono text-xs text-muted-foreground/70">{src}</p>
        </div>
        <p className="max-w-md text-xs text-muted-foreground/80">
          Placeholder screenshot — simpan gambar di path di atas untuk mengganti tampilan ini.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted shadow-sm",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, 720px"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
