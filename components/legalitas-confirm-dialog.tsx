"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface RegistrationContext {
  hasAktaDocument: boolean
  hasLegalitasDocument: boolean
}

interface LegalitasConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  registrationContext?: RegistrationContext
}

export default function LegalitasConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  registrationContext,
}: LegalitasConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pendaftaran</DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {registrationContext &&
            (!registrationContext.hasAktaDocument || !registrationContext.hasLegalitasDocument) && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 space-y-1">
                <p className="font-medium">Dokumen belum dilengkapi:</p>
                {!registrationContext.hasAktaDocument && <p>• Akta Pendirian belum diupload.</p>}
                {!registrationContext.hasLegalitasDocument && (
                  <p>• Dokumen legalitas perusahaan belum diupload.</p>
                )}
                <p className="pt-1">
                  Anda tetap dapat melanjutkan pendaftaran. Admin akan mereview dokumen yang belum ada.
                </p>
              </div>
            )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 space-y-1">
            <p>• Verifikasi KTP akan direview oleh tim admin.</p>
            <p>• Status bisnis Anda akan <strong>under review</strong> hingga proses verifikasi selesai.</p>
          </div>

          <p className="text-sm text-muted-foreground">
            Pastikan data yang Anda isi sudah benar, lalu klik Kirim untuk menyelesaikan pendaftaran.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            type="button"
            className="bg-primary hover:bg-primary/90"
            disabled={loading}
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
