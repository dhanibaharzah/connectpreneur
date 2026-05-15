"use client"

import type { ComponentType } from "react"
import { useEffect, useState, useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Loader2, Users, Eye, MessageCircle, Globe, Share2, BookOpen } from "lucide-react"
import type { AdminUser } from "./admin-shell"
import AdminShell, { getAdminAuthHeaders } from "./admin-shell"
import { JabarAnalyticsMap } from "./jabar-analytics-map"
import { JAWA_BARAT_KAB_KOTA_LIST } from "@/lib/analytics/jabar-gadm-map"
import { mitraHeatmapFill } from "@/lib/analytics/mitra-heatmap-fill"

interface AnalyticsOverview {
  mitra_unique_visitors: number
  catalog_unique_visitors: number
  catalog_cta_unique: number
  whatsapp_unique: number
  website_unique: number
  social_unique: number
  total_events: number
}

interface MitraStat {
  id: number
  nama: string
  slug: string
  kab_kota: string
  unique_visitors: number
  whatsapp_unique: number
  website_unique: number
  social_unique: number
}

interface KabKotaStat {
  kab_kota: string
  unique_visitors: number
  mitra_count: number
}

interface VisitorOrigin {
  city: string
  region: string
  unique_visitors: number
}

interface SocialPlatform {
  platform: string
  unique_visitors: number
}

interface AnalyticsData {
  overview: AnalyticsOverview
  mitraStats: MitraStat[]
  byKabKota: KabKotaStat[]
  visitorOrigins: VisitorOrigin[]
  socialByPlatform: SocialPlatform[]
}

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
]

const ENGAGEMENT_COLORS: Record<string, string> = {
  "Katalog (/katalog)": "#6366f1",
  "CTA Katalog": "#8b5cf6",
  WhatsApp: "#22c55e",
  Website: "#3b82f6",
  "Sosial Media": "#ec4899",
}

const STAT_ACCENTS = [
  { bg: "bg-indigo-100", text: "text-indigo-600", bar: "#6366f1" },
  { bg: "bg-violet-100", text: "text-violet-600", bar: "#8b5cf6" },
  { bg: "bg-emerald-100", text: "text-emerald-600", bar: "#10b981" },
  { bg: "bg-amber-100", text: "text-amber-600", bar: "#f59e0b" },
  { bg: "bg-green-100", text: "text-green-600", bar: "#22c55e" },
  { bg: "bg-sky-100", text: "text-sky-600", bar: "#0ea5e9" },
  { bg: "bg-pink-100", text: "text-pink-600", bar: "#ec4899" },
]

const PLATFORM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  instagram: { bg: "bg-gradient-to-br from-purple-100 to-pink-100", text: "text-pink-600", border: "border-pink-200" },
  facebook: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  tiktok: { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-300" },
  unknown: { bg: "bg-muted/50", text: "text-muted-foreground", border: "border-border" },
}

function chartColor(index: number) {
  return CHART_COLORS[index % CHART_COLORS.length]
}

function StatCard({
  title,
  value,
  icon: Icon,
  accentIndex = 0,
}: {
  title: string
  value: number
  icon: ComponentType<{ className?: string }>
  accentIndex?: number
}) {
  const accent = STAT_ACCENTS[accentIndex % STAT_ACCENTS.length]
  return (
    <Card className="overflow-hidden gap-0 p-0">
      <div className="h-1 w-full shrink-0" style={{ backgroundColor: accent.bar }} />
      <CardContent className="px-3 pt-4 pb-4 sm:px-5 sm:pt-5 sm:pb-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{value.toLocaleString("id-ID")}</p>
          </div>
          <div className={cn("rounded-lg shrink-0 p-2", accent.bg)}>
            <Icon className={cn("h-5 w-5", accent.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardOverviewStats({ overview }: { overview: AnalyticsOverview }) {
  return (
    <div
      className="flex flex-nowrap gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable]"
      role="region"
      aria-label="Ringkasan pengunjung dan klik"
    >
      <div className="min-w-[140px] flex-1 basis-0 shrink-0">
        <StatCard
          title="Pengunjung Mitra"
          value={overview.mitra_unique_visitors}
          icon={Eye}
          accentIndex={0}
        />
      </div>
      <div className="min-w-[140px] flex-1 basis-0 shrink-0">
        <StatCard
          title="Kunjungan Katalog"
          value={overview.catalog_unique_visitors}
          icon={BookOpen}
          accentIndex={1}
        />
      </div>
      <div className="min-w-[140px] flex-1 basis-0 shrink-0">
        <StatCard
          title="Klik CTA Katalog"
          value={overview.catalog_cta_unique}
          icon={Users}
          accentIndex={2}
        />
      </div>
      <div className="min-w-[140px] flex-1 basis-0 shrink-0">
        <StatCard
          title="Klik WhatsApp"
          value={overview.whatsapp_unique}
          icon={MessageCircle}
          accentIndex={3}
        />
      </div>
      <div className="min-w-[140px] flex-1 basis-0 shrink-0">
        <StatCard
          title="Klik Website"
          value={overview.website_unique}
          icon={Globe}
          accentIndex={4}
        />
      </div>
      <div className="min-w-[140px] flex-1 basis-0 shrink-0">
        <StatCard
          title="Klik Media Sosial"
          value={overview.social_unique}
          icon={Share2}
          accentIndex={5}
        />
      </div>
    </div>
  )
}

function truncateLabel(value: string, max = 18) {
  return value.length > max ? `${value.slice(0, max)}…` : value
}

export default function AnalyticsDashboard({ user }: { user: AdminUser }) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/analytics", {
          credentials: "include",
          headers: getAdminAuthHeaders(),
        })
        const json = await res.json()
        if (!res.ok) {
          setError(json.error || "Gagal memuat data")
          return
        }
        setData(json)
      } catch {
        setError("Gagal memuat data analytics")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const mapStats = useMemo(() => {
    if (!data) return []
    const visits = new Map(data.byKabKota.map((r) => [r.kab_kota, r.unique_visitors]))
    return JAWA_BARAT_KAB_KOTA_LIST.map((kab_kota) => ({
      kab_kota,
      unique_visitors: visits.get(kab_kota) ?? 0,
      mitra_count: data.mitraStats.filter((m) => m.kab_kota === kab_kota).length,
    }))
  }, [data])

  const topMitra = (data?.mitraStats ?? [])
    .filter((m) => m.unique_visitors > 0)
    .slice(0, 12)
    .map((m) => ({
      name: truncateLabel(m.nama, 16),
      fullName: m.nama,
      unique_visitors: m.unique_visitors,
    }))

  const kabKotaChart = (data?.byKabKota ?? []).slice(0, 12).map((k) => ({
    name: truncateLabel(k.kab_kota, 14),
    fullName: k.kab_kota,
    unique_visitors: k.unique_visitors,
    mitra_count: k.mitra_count,
  }))

  const topMitraMax =
    topMitra.length > 0 ? Math.max(1, ...topMitra.map((m) => m.unique_visitors)) : 1
  const kabKotaChartMax =
    kabKotaChart.length > 0 ? Math.max(1, ...kabKotaChart.map((k) => k.unique_visitors)) : 1

  const visitorChart = (data?.visitorOrigins ?? []).slice(0, 12).map((v) => ({
    name: truncateLabel(v.city, 14),
    fullName: v.region ? `${v.city}, ${v.region}` : v.city,
    unique_visitors: v.unique_visitors,
  }))

  const engagementChart = data
    ? [
        { name: "Katalog (/katalog)", value: data.overview.catalog_unique_visitors },
        { name: "CTA Katalog", value: data.overview.catalog_cta_unique },
        { name: "WhatsApp", value: data.overview.whatsapp_unique },
        { name: "Website", value: data.overview.website_unique },
        { name: "Sosial Media", value: data.overview.social_unique },
      ]
    : []

  return (
    <AdminShell user={user}>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pengunjung unik sepanjang waktu · Lokasi mitra per kab/kota · Asal pengunjung dari geo IP (gratis via Vercel)
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-destructive py-8">{error}</p>
        )}

        {data && !loading && (
          <>
            <DashboardOverviewStats overview={data.overview} />

            {mapStats.length > 0 && (
              <div className="min-w-0">
                <JabarAnalyticsMap mapStats={mapStats} />
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Mitra — Pengunjung Unik</CardTitle>
                  <CardDescription>Per halaman detail mitra</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {topMitra.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-12">Belum ada data</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topMitra} layout="vertical" margin={{ left: 8, right: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(v: number) => [v, "Pengunjung unik"]}
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload?.fullName ?? ""
                          }
                        />
                        <Bar dataKey="unique_visitors" radius={[0, 4, 4, 0]}>
                          {topMitra.map((row, i) => (
                            <Cell
                              key={`mitra-${row.fullName}-${i}`}
                              fill={mitraHeatmapFill(row.unique_visitors, topMitraMax)}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pengunjung per Kab/Kota Mitra</CardTitle>
                  <CardDescription>Agregasi berdasarkan lokasi mitra</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {kabKotaChart.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-12">Belum ada data</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={kabKotaChart} margin={{ bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          angle={-35}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                          formatter={(v: number) => [v, "Pengunjung unik"]}
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload?.fullName ?? ""
                          }
                        />
                        <Bar dataKey="unique_visitors" radius={[4, 4, 0, 0]}>
                          {kabKotaChart.map((row, i) => (
                            <Cell
                              key={`kab-${row.fullName}-${i}`}
                              fill={mitraHeatmapFill(row.unique_visitors, kabKotaChartMax)}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Asal Pengunjung (Geo IP)</CardTitle>
                  <CardDescription>Kota asal pengunjung — estimasi dari IP</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {visitorChart.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-12">
                      Belum ada data geo (muncul setelah deploy di Vercel)
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={visitorChart} margin={{ bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          angle={-35}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                          formatter={(v: number) => [v, "Pengunjung unik"]}
                          labelFormatter={(_, payload) =>
                            payload?.[0]?.payload?.fullName ?? ""
                          }
                        />
                        <Bar dataKey="unique_visitors" radius={[4, 4, 0, 0]}>
                          {visitorChart.map((_, i) => (
                            <Cell key={`visitor-${i}`} fill={chartColor(i + 4)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interaksi Katalog & Kontak</CardTitle>
                  <CardDescription>Pengunjung unik per jenis aksi</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementChart} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip formatter={(v: number) => [v, "Pengunjung unik"]} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {engagementChart.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={ENGAGEMENT_COLORS[entry.name] ?? chartColor(0)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {data.socialByPlatform.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Klik Media Sosial per Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {data.socialByPlatform.map((s) => {
                      const style =
                        PLATFORM_COLORS[s.platform.toLowerCase()] ?? PLATFORM_COLORS.unknown
                      return (
                        <div
                          key={s.platform}
                          className={`px-4 py-3 rounded-lg border min-w-[120px] ${style.bg} ${style.border}`}
                        >
                          <p className={`text-sm capitalize font-medium ${style.text}`}>
                            {s.platform}
                          </p>
                          <p className={`text-xl font-bold ${style.text}`}>{s.unique_visitors}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Semua Mitra</CardTitle>
                <CardDescription>Pengunjung unik & klik kontak (sepanjang waktu)</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 pr-4">Mitra</th>
                      <th className="pb-2 pr-4">Kab/Kota</th>
                      <th className="pb-2 pr-4 text-right">Kunjungan</th>
                      <th className="pb-2 pr-4 text-right">WA</th>
                      <th className="pb-2 pr-4 text-right">Web</th>
                      <th className="pb-2 text-right">Sosial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.mitraStats.map((m) => (
                      <tr key={m.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium">{m.nama}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{m.kab_kota}</td>
                        <td className="py-2 pr-4 text-right">{m.unique_visitors}</td>
                        <td className="py-2 pr-4 text-right">{m.whatsapp_unique}</td>
                        <td className="py-2 pr-4 text-right">{m.website_unique}</td>
                        <td className="py-2 text-right">{m.social_unique}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminShell>
  )
}