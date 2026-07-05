"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { trackEvent } from "@/lib/analytics/client"
import { katalogPortalUrl } from "@/lib/shared/app-url"

interface CatalogCtaLinkProps {
  className?: string
  children: ReactNode
}

export function CatalogCtaLink({ className, children }: CatalogCtaLinkProps) {
  return (
    <Link
      href={katalogPortalUrl("/")}
      className={className}
      onClick={() => trackEvent({ eventType: "catalog_cta_click" })}
    >
      {children}
    </Link>
  )
}
