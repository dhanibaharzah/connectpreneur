"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

const LEGALITAS_ITEMS = [
  { id: "akta", label: "Akta Pendirian", required: true },
  { id: "nib", label: "NIB", required: true },
  { id: "npwp", label: "NPWP Perusahaan", required: true },
  { id: "haki", label: "HAKI", required: false },
  { id: "domisili", label: "Domisili Perusahaan", required: false },
  { id: "siup", label: "SIUP", required: false },
  { id: "tdp", label: "TDP", required: false },
  { id: "skt", label: "SKT", required: false },
] as const

interface LegalitasConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

export default function LegalitasConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
}: LegalitasConfirmDialogProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  // Reset checkboxes when dialog opens
  useEffect(() => {
    if (open) {
      setChecked({})
    }
  }, [open])

  const toggleItem = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const requiredItems = LEGALITAS_ITEMS.filter((item) => item.required)
  const allRequiredChecked = requiredItems.every((item) => checked[item.id])

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Legalitas</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <p className="text-sm text-muted-foreground mb-4">
            Apakah sudah diperiksa dengan benar? Dengan ini saya menyatakan bahwa Legalitas berikut benar-benar sudah ada:
          </p>

          <div className="space-y-3">
            {LEGALITAS_ITEMS.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={!!checked[item.id]}
                  onChange={() => toggleItem(item.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm group-hover:text-foreground">
                  {item.label}
                  {item.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </label>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            <span className="text-red-500">*</span> Wajib dicentang untuk melanjutkan
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            type="button"
            className="bg-primary hover:bg-primary/90"
            disabled={!allRequiredChecked || loading}
            onClick={onConfirm}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Ya, Kirim"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
