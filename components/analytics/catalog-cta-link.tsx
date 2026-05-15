"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { trackEvent } from "@/lib/analytics/client"

interface CatalogCtaLinkProps {
  className?: string
  children: ReactNode
}

export function CatalogCtaLink({ className, children }: CatalogCtaLinkProps) {
  return (
    <Link
      href="/katalog"
      className={className}
      onClick={() => trackEvent({ eventType: "catalog_cta_click" })}
    >
      {children}
    </Link>
  )
}
