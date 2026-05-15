import type { NextRequest } from "next/server"

export interface VisitorGeo {
  city: string | null
  region: string | null
  country: string | null
}

/** Free geo from Vercel edge headers (no third-party API). */
export function getVisitorGeoFromRequest(request: NextRequest): VisitorGeo {
  const city = request.headers.get("x-vercel-ip-city")
  const region = request.headers.get("x-vercel-ip-country-region")
  const country = request.headers.get("x-vercel-ip-country")

  return {
    city: city ? decodeURIComponent(city) : null,
    region: region ? decodeURIComponent(region) : null,
    country: country || null,
  }
}
