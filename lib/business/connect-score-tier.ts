export type ConnectScoreTier = "unggulan" | "berkualitas" | "dasar" | "wajib_perbaikan"

export const CONNECT_SCORE_TIER_ALL = "Semua" as const

export type ConnectScoreTierFilter = ConnectScoreTier | typeof CONNECT_SCORE_TIER_ALL

export interface ConnectScoreTierMeta {
  id: ConnectScoreTier
  label: string
  shortLabel: string
  description: string
  className: string
}

export const CONNECT_SCORE_TIERS: ConnectScoreTierMeta[] = [
  {
    id: "unggulan",
    label: "UMKM Unggulan",
    shortLabel: "Unggulan",
    description: "ConnectScore 90–100",
    className: "text-emerald-800 bg-emerald-50 border-emerald-200",
  },
  {
    id: "berkualitas",
    label: "UMKM Berkualitas",
    shortLabel: "Berkualitas",
    description: "ConnectScore 70–89",
    className: "text-blue-800 bg-blue-50 border-blue-200",
  },
  {
    id: "dasar",
    label: "UMKM Dasar",
    shortLabel: "Dasar",
    description: "ConnectScore 60–69, atau terverifikasi tanpa legalitas",
    className: "text-amber-800 bg-amber-50 border-amber-200",
  },
  {
    id: "wajib_perbaikan",
    label: "Wajib Perbaikan",
    shortLabel: "Perbaikan",
    description: "Score di bawah 60 atau belum ada akta & legalitas",
    className: "text-red-800 bg-red-50 border-red-200",
  },
]

const TIER_MAP = new Map(CONNECT_SCORE_TIERS.map((tier) => [tier.id, tier]))

export function hasDocument(url: string | null | undefined): boolean {
  return typeof url === "string" && url.trim().length > 0
}

export interface ConnectScoreTierOptions {
  hasAkta?: boolean
  hasLegalitas?: boolean
  isVerified?: boolean
}

export function isWajibPerbaikan(
  score: number,
  options?: ConnectScoreTierOptions,
): boolean {
  const missingBothDocs = !options?.hasAkta && !options?.hasLegalitas
  return score < 60 || missingBothDocs
}

export function getConnectScoreTier(
  score: number | null | undefined,
  options?: ConnectScoreTierOptions,
): ConnectScoreTier | null {
  if (score == null || Number.isNaN(score)) return null

  const hasLegalitas = options?.hasLegalitas ?? false
  const isVerified = options?.isVerified ?? false

  // Mitra terverifikasi tanpa legalitas → UMKM Dasar
  if (isVerified && !hasLegalitas) {
    return "dasar"
  }

  if (isWajibPerbaikan(score, options)) {
    return "wajib_perbaikan"
  }
  if (score >= 90) return "unggulan"
  if (score >= 70) return "berkualitas"
  if (score >= 60) return "dasar"
  return "wajib_perbaikan"
}

export function getConnectScoreTierMeta(tier: ConnectScoreTier | null | undefined): ConnectScoreTierMeta | null {
  if (!tier) return null
  return TIER_MAP.get(tier) ?? null
}

export function resolveConnectScoreTierFromBusiness(input: {
  connectScore?: number | null
  connect_score?: number | null
  akta_pendirian_url?: string | null
  legalitas_url?: string | null
  is_active?: boolean | null
  isVerified?: boolean | null
}): ConnectScoreTier | null {
  const score = input.connectScore ?? input.connect_score ?? null
  return getConnectScoreTier(score, {
    hasAkta: hasDocument(input.akta_pendirian_url),
    hasLegalitas: hasDocument(input.legalitas_url),
    isVerified: input.isVerified ?? input.is_active === true,
  })
}
