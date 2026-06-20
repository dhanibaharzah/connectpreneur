"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import { Upload, X, Loader2 } from "lucide-react"
import type { AdminBusinessFormState } from "./business-form-types"

interface BusinessFormTabLegalitasProps {
  form: AdminBusinessFormState
  uploadingAkta: boolean
  uploadingLegalitas: boolean
  aktaInputRef: React.RefObject<HTMLInputElement | null>
  legalitasInputRef: React.RefObject<HTMLInputElement | null>
  onUploadAkta: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveAkta: () => void
  onUploadLegalitas: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveLegalitas: () => void
}

export function BusinessFormTabLegalitas({
  form,
  uploadingAkta,
  uploadingLegalitas,
  aktaInputRef,
  legalitasInputRef,
  onUploadAkta,
  onRemoveAkta,
  onUploadLegalitas,
  onRemoveLegalitas,
}: BusinessFormTabLegalitasProps) {
  return (
    <TabsContent value="legalitas" forceMount className="data-[state=inactive]:hidden space-y-6 mt-4">
      <div className="space-y-2">
        <Label>Akta Pendirian Perusahaan beserta Perubahannya</Label>
        {form.akta_pendirian_url ? (
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Akta Pendirian.pdf</p>
                <a href={form.akta_pendirian_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  Lihat file
                </a>
              </div>
            </div>
            <button type="button" onClick={onRemoveAkta} className="shrink-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => aktaInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          >
            {uploadingAkta ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mt-2">Klik untuk upload PDF</span>
                <span className="text-xs text-muted-foreground mt-1">Maksimal 10MB</span>
              </>
            )}
          </div>
        )}
        <input ref={aktaInputRef} type="file" accept=".pdf,application/pdf" onChange={onUploadAkta} className="hidden" />
      </div>

      <div className="space-y-2">
        <Label>Legalitas Perusahaan</Label>
        <p className="text-xs text-muted-foreground">
          SIUP, TDP, NIB, Domisili Perusahaan, SKT, NPWP Perusahaan, HAKI — <strong>Jadikan dalam 1 file PDF</strong>
        </p>
        {form.legalitas_url ? (
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Legalitas Perusahaan.pdf</p>
                <a href={form.legalitas_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  Lihat file
                </a>
              </div>
            </div>
            <button type="button" onClick={onRemoveLegalitas} className="shrink-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => legalitasInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          >
            {uploadingLegalitas ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mt-2">Klik untuk upload PDF</span>
                <span className="text-xs text-muted-foreground mt-1">Maksimal 10MB</span>
              </>
            )}
          </div>
        )}
        <input ref={legalitasInputRef} type="file" accept=".pdf,application/pdf" onChange={onUploadLegalitas} className="hidden" />
      </div>
    </TabsContent>
  )
}
