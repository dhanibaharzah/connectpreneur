"use client"

import { cn } from "@/lib/utils"

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50 border-green-200"
  if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200"
  if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200"
  return "text-red-600 bg-red-50 border-red-200"
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Sangat Lengkap"
  if (score >= 60) return "Lengkap"
  if (score >= 40) return "Cukup"
  return "Perlu Dilengkapi"
}

function getProgressColor(score: number): string {
  if (score >= 80) return "bg-green-500"
  if (score >= 60) return "bg-blue-500"
  if (score >= 40) return "bg-yellow-500"
  return "bg-red-500"
}

interface ConnectScoreBadgeProps {
  score: number
  size?: "sm" | "md"
  className?: string
}

export function ConnectScoreBadge({ score, size = "sm", className }: ConnectScoreBadgeProps) {
  const colorClass = getScoreColor(score)

  if (size === "sm") {
    return (
      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold", colorClass, className)}>
        <span>{score}</span>
      </span>
    )
  }

  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border font-semibold text-sm", colorClass, className)}>
      <span>{score}/100</span>
      <span className="text-xs font-normal opacity-75">{getScoreLabel(score)}</span>
    </div>
  )
}

const SCORE_LABELS: Record<string, string> = {
  deskripsi: "Deskripsi Bisnis",
  lama_usaha: "Lama Usaha",
  logo_url: "Logo Bisnis",
  category_id: "Kategori",
  alamat: "Alamat",
  location_id: "Lokasi",
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  jenis_peluang: "Jenis Peluang",
  deskripsi_kemitraan: "Deskripsi Kemitraan",
  product_images: "Foto Produk",
  akta_pendirian_url: "Akta Pendirian",
  legalitas_url: "Legalitas Perusahaan",
  nama_pic: "Nama PIC",
  jabatan_pic: "Jabatan PIC",
  kontak_pic: "Kontak PIC",
}

const SCORE_MAX: Record<string, number> = {
  deskripsi: 8,
  lama_usaha: 4,
  logo_url: 8,
  category_id: 5,
  alamat: 5,
  location_id: 5,
  website: 5,
  instagram: 5,
  facebook: 3,
  tiktok: 2,
  jenis_peluang: 5,
  deskripsi_kemitraan: 8,
  product_images: 10,
  akta_pendirian_url: 10,
  legalitas_url: 5,
  nama_pic: 4,
  jabatan_pic: 3,
  kontak_pic: 5,
}

interface ConnectScoreDetailProps {
  score: number
  breakdown: Record<string, number>
  className?: string
}

export function ConnectScoreDetail({ score, breakdown, className }: ConnectScoreDetailProps) {
  const progressColor = getProgressColor(score)

  // Group breakdown items by category
  const categories = [
    { label: "Profil Bisnis", keys: ["deskripsi", "lama_usaha", "logo_url", "category_id"] },
    { label: "Lokasi", keys: ["alamat", "location_id"] },
    { label: "Digital Presence", keys: ["website", "instagram", "facebook", "tiktok"] },
    { label: "Kemitraan", keys: ["jenis_peluang", "deskripsi_kemitraan"] },
    { label: "Media", keys: ["product_images"] },
    { label: "Legalitas", keys: ["akta_pendirian_url", "legalitas_url"] },
    { label: "PIC", keys: ["nama_pic", "jabatan_pic", "kontak_pic"] },
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall score */}
      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold">{score}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium">ConnectScore</span>
            <span className="text-muted-foreground">{score}/100</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", progressColor)}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{getScoreLabel(score)}</p>
        </div>
      </div>

      {/* Breakdown by category */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const catEarned = cat.keys.reduce((sum, k) => sum + (breakdown[k] || 0), 0)
          const catMax = cat.keys.reduce((sum, k) => sum + (SCORE_MAX[k] || 0), 0)
          const catPct = catMax > 0 ? Math.round((catEarned / catMax) * 100) : 0

          return (
            <div key={cat.label}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-foreground">{cat.label}</span>
                <span className="text-xs text-muted-foreground">{catEarned}/{catMax}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", getProgressColor(catPct))}
                  style={{ width: `${catPct}%` }}
                />
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                {cat.keys.map((key) => {
                  const earned = breakdown[key] || 0
                  const max = SCORE_MAX[key] || 0
                  const filled = earned > 0
                  return (
                    <span key={key} className={cn("text-xs", filled ? "text-foreground" : "text-muted-foreground/50 line-through")}>
                      {SCORE_LABELS[key] || key}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
