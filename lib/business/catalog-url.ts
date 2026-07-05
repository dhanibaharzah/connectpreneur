import { katalogPortalUrl } from "@/lib/shared/app-url"

export function businessCatalogUrl(slug: string): string {
  return katalogPortalUrl(`/bisnis/${slug}`)
}
