import { appUrl } from "@/lib/app-url"

export function businessCatalogUrl(slug: string): string {
  return appUrl(`/bisnis/${slug}`)
}
