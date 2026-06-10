"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConnectScoreTierBadge } from "@/components/connect-score-tier-badge"
import { ConnectScoreBadge } from "@/components/connect-score-badge"
import { Loader2, Upload, X, FileText, ExternalLink } from "lucide-react"
import type { ConnectScoreTier } from "@/lib/connect-score-tier"

export function UmkmLegalitasPanel() {
  const [aktaUrl, setAktaUrl] = useState("")
  const [legalitasUrl, setLegalitasUrl] = useState("")
  const [connectScore, setConnectScore] = useState<number | null>(null)
  const [connectScoreTier, setConnectScoreTier] = useState<ConnectScoreTier | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadingAkta, setUploadingAkta] = useState(false)
  const [uploadingLegalitas, setUploadingLegalitas] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const aktaInputRef = useRef<HTMLInputElement>(null)
  const legalitasInputRef = useRef<HTMLInputElement>(null)

  const loadLegalitas = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/umkm/legalitas", { credentials: "include" })
      if (res.status === 401) throw new Error("Sesi berakhir, silakan masuk kembali")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal memuat dokumen legalitas")
      setAktaUrl(data.akta_pendirian_url || "")
      setLegalitasUrl(data.legalitas_url || "")
      setConnectScore(data.connect_score ?? null)
      setConnectScoreTier(data.connect_score_tier ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat dokumen legalitas")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLegalitas()
  }, [loadLegalitas])

  const uploadPdf = async (file: File): Promise<string | null> => {
    if (file.type !== "application/pdf") {
      setError("Hanya file PDF yang diperbolehkan")
      return null
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Ukuran file maksimal 10MB")
      return null
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "documents")

    const res = await fetch("/api/register-mitra/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Gagal upload file")
    return data.url as string
  }

  const saveDocuments = async (nextAkta: string, nextLegalitas: string) => {
    setSaving(true)
    setError("")
    setMessage("")
    try {
      const res = await fetch("/api/umkm/legalitas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          akta_pendirian_url: nextAkta || null,
          legalitas_url: nextLegalitas || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan dokumen")
      setAktaUrl(data.akta_pendirian_url || "")
      setLegalitasUrl(data.legalitas_url || "")
      setConnectScore(data.connect_score ?? null)
      setConnectScoreTier(data.connect_score_tier ?? null)
      setMessage("Dokumen legalitas berhasil disimpan. ConnectScore diperbarui.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan dokumen")
    } finally {
      setSaving(false)
    }
  }

  const handleUploadAkta = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setUploadingAkta(true)
    setError("")
    try {
      const url = await uploadPdf(file)
      if (!url) return
      setAktaUrl(url)
      await saveDocuments(url, legalitasUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload akta")
    } finally {
      setUploadingAkta(false)
    }
  }

  const handleUploadLegalitas = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setUploadingLegalitas(true)
    setError("")
    try {
      const url = await uploadPdf(file)
      if (!url) return
      setLegalitasUrl(url)
      await saveDocuments(aktaUrl, url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload legalitas")
    } finally {
      setUploadingLegalitas(false)
    }
  }

  const removeAkta = async () => {
    await saveDocuments("", legalitasUrl)
  }

  const removeLegalitas = async () => {
    await saveDocuments(aktaUrl, "")
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <div>
          <h2 className="font-semibold">Dokumen Legalitas</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Upload atau perbarui akta dan legalitas perusahaan. Dokumen ini mempengaruhi ConnectScore dan badge UMKM Anda.
          </p>
        </div>

        {(connectScore != null || connectScoreTier) && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/50 p-3">
            <span className="text-sm text-muted-foreground">ConnectScore saat ini:</span>
            {connectScoreTier && <ConnectScoreTierBadge tier={connectScoreTier} size="md" />}
            {connectScore != null && <ConnectScoreBadge score={connectScore} size="md" />}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Akta Pendirian Perusahaan</p>
          {aktaUrl ? (
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
              <FileText className="h-8 w-8 text-red-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Akta Pendirian.pdf</p>
                <a
                  href={aktaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
                >
                  Lihat file
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={removeAkta} disabled={saving || uploadingAkta}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => aktaInputRef.current?.click()}
              disabled={uploadingAkta || saving}
              className="w-full border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              {uploadingAkta ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Upload className="h-6 w-6 mb-2" />
                  Upload PDF Akta
                </>
              )}
            </button>
          )}
          <input ref={aktaInputRef} type="file" accept=".pdf,application/pdf" onChange={handleUploadAkta} className="hidden" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Legalitas Perusahaan</p>
          <p className="text-xs text-muted-foreground">
            SIUP, TDP, NIB, NPWP, HAKI, dll. — jadikan dalam 1 file PDF.
          </p>
          {legalitasUrl ? (
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
              <FileText className="h-8 w-8 text-red-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Legalitas Perusahaan.pdf</p>
                <a
                  href={legalitasUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
                >
                  Lihat file
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeLegalitas}
                disabled={saving || uploadingLegalitas}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => legalitasInputRef.current?.click()}
              disabled={uploadingLegalitas || saving}
              className="w-full border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              {uploadingLegalitas ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Upload className="h-6 w-6 mb-2" />
                  Upload PDF Legalitas
                </>
              )}
            </button>
          )}
          <input
            ref={legalitasInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleUploadLegalitas}
            className="hidden"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
      </CardContent>
    </Card>
  )
}
