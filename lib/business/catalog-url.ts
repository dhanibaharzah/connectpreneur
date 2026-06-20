import { appUrl } from "@/lib/shared/app-url"

export function businessCatalogUrl(slug: string): string {
  return appUrl(`/bisnis/${slug}`)
}
