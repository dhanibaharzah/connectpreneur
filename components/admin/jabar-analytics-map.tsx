"use client"

import { useMemo, useState, useCallback, useEffect } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { geoMercator } from "d3-geo"
import type { FeatureCollection } from "geojson"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { kabKotaFromGadmFeature } from "@/lib/analytics/jabar-gadm-map"
import { mitraHeatmapFill } from "@/lib/analytics/mitra-heatmap-fill"

export interface KabKotaMapStat {
  kab_kota: string
  unique_visitors: number
  mitra_count: number
}

interface HoverInfo {
  kabKota: string
  unique_visitors: number
  mitra_count: number
}

const GEO_URL = "/geo/jabar-kabkota.json"

/** SVG size; projection.fitExtent fills this box tightly (minus padding). */
const MAP_W = 1080
const MAP_H = 648
const FIT_PADDING = 4

/** Dark orange borders (batas wilayah), aligned with dashboard orange */
const BORDER_DARK_ORANGE = "#9a3412"
const BORDER_DARK_ORANGE_HOVER = "#7c2d12"

export function JabarAnalyticsMap({ mapStats }: { mapStats: KabKotaMapStat[] }) {
  const [geo, setGeo] = useState<FeatureCollection | null>(null)
  const [geoError, setGeoError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(GEO_URL)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText)
        return r.json() as Promise<FeatureCollection>
      })
      .then((json) => {
        if (!cancelled) {
          setGeo(json)
          setGeoError(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGeo(null)
          setGeoError(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const projection = useMemo(() => {
    if (!geo?.features?.length) {
      return geoMercator()
        .center([107.55, -6.92])
        .scale(14_200)
        .translate([MAP_W / 2, MAP_H / 2])
    }
    return geoMercator().fitExtent(
      [
        [FIT_PADDING, FIT_PADDING],
        [MAP_W - FIT_PADDING, MAP_H - FIT_PADDING],
      ],
      geo,
    )
  }, [geo])

  const statsByKab = useMemo(() => {
    const m = new Map<string, KabKotaMapStat>()
    for (const row of mapStats) {
      m.set(row.kab_kota, row)
    }
    return m
  }, [mapStats])

  const maxVisitors = useMemo(() => {
    return Math.max(1, ...mapStats.map((r) => r.unique_visitors))
  }, [mapStats])

  const [hover, setHover] = useState<HoverInfo | null>(null)

  const clearHover = useCallback(() => setHover(null), [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Peta Jawa Barat — 27 Kab/Kota</CardTitle>
        <CardDescription>
          Intensitas pengunjung unik per wilayah mitra (arahkan kursor untuk detail). Semakin oranye mengikuti warna
          Dashboard — semakin tinggi kunjungan halaman mitra.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative pt-0">
        {geoError ? (
          <div className="relative w-full rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
            Gagal memuat data peta. Periksa file geo atau jaringan.
          </div>
        ) : !geo ? (
          <div
            className="relative w-full rounded-lg border bg-muted/20 animate-pulse text-center text-sm text-muted-foreground py-[min(28vh,12rem)]"
            aria-busy
          >
            Memuat peta…
          </div>
        ) : (
          <div
            className="relative mx-auto w-full max-w-full rounded-lg border bg-slate-50 overflow-hidden"
            role="img"
            aria-label="Peta interaktif Jawa Barat"
            onMouseLeave={clearHover}
          >
            <ComposableMap
              projection={projection}
              width={MAP_W}
              height={MAP_H}
              className="mx-auto block h-auto w-full max-h-[min(88vh,calc(100dvh-6rem))] max-w-full min-h-[120px]"
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: "visible" }}
            >
              <Geographies geography={geo}>
                {({ geographies }) =>
                  geographies.map((geoFeature) => {
                    const kabKey = kabKotaFromGadmFeature(geoFeature)
                    const stat = kabKey ? statsByKab.get(kabKey) : undefined
                    const visitors = stat?.unique_visitors ?? 0
                    const mitras = stat?.mitra_count ?? 0

                    return (
                      <Geography
                        key={geoFeature.rsmKey}
                        geography={geoFeature}
                        onMouseEnter={() => {
                          if (!kabKey) return
                          setHover({
                            kabKota: kabKey,
                            unique_visitors: visitors,
                            mitra_count: mitras,
                          })
                        }}
                        onMouseLeave={clearHover}
                        style={{
                          default: {
                            outline: "none",
                            stroke: BORDER_DARK_ORANGE,
                            strokeWidth: 0.75,
                            fill: mitraHeatmapFill(visitors, maxVisitors),
                          },
                          hover: {
                            outline: "none",
                            stroke: BORDER_DARK_ORANGE_HOVER,
                            strokeWidth: 1.15,
                            fill: mitraHeatmapFill(Math.max(visitors, 1), maxVisitors),
                            filter: "brightness(1.05)",
                          },
                          pressed: {
                            outline: "none",
                            stroke: BORDER_DARK_ORANGE,
                            strokeWidth: 0.75,
                          },
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>

            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-end justify-between gap-3 pointer-events-none">
              {hover ? (
                <div className="pointer-events-none rounded-lg border bg-white/95 px-3 py-2 text-sm shadow-md backdrop-blur-sm max-w-md">
                  <p className="font-semibold text-foreground">{hover.kabKota}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Pengunjung unik:{" "}
                    <span className="font-semibold text-foreground">{hover.unique_visitors}</span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Mitra terdaftar:{" "}
                    <span className="font-semibold text-foreground">{hover.mitra_count}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded border shadow-sm">
                  Arahkan kursor ke kab/kota untuk melihat angka.
                </p>
              )}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-white/80 px-2 py-1 rounded border">
                <span className="inline-block h-3 w-3 rounded-sm bg-[#f4f4f5] border" /> 0
                <span
                  className="inline-block h-3 w-3 rounded-sm border border-orange-200"
                  style={{ background: mitraHeatmapFill(1, 1) }}
                />{" "}
                Tinggi
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
