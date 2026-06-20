import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DaftarMitraSuccessProps {
  successMessage: string
  autoApproved: boolean
  showLegalitasNote: boolean
}

export function DaftarMitraSuccess({
  successMessage,
  autoApproved,
  showLegalitasNote,
}: DaftarMitraSuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${autoApproved ? "bg-green-100" : "bg-amber-100"}`}
          >
            <CheckCircle
              className={`h-10 w-10 ${autoApproved ? "text-green-600" : "text-amber-600"}`}
            />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Pendaftaran Berhasil!</h2>
          <p className="text-muted-foreground mb-6">{successMessage}</p>
          {!autoApproved && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              Verifikasi KTP akan direview oleh tim admin. Status bisnis Anda saat ini under review.
              {showLegalitasNote && (
                <> Dokumen legalitas yang belum diupload dapat dilengkapi kemudian.</>
              )}
            </p>
          )}
          <p className="text-sm text-muted-foreground mb-6">
            Notifikasi telah dikirim ke WhatsApp yang Anda daftarkan.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
