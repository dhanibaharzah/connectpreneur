"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { PembeliLoginForm } from "@/components/pembeli/pembeli-login-form"

interface PembeliLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PembeliLoginDialog({ open, onOpenChange }: PembeliLoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Masuk Akun Pembeli</DialogTitle>
          <DialogDescription>Login dengan OTP WhatsApp</DialogDescription>
        </DialogHeader>
        <PembeliLoginForm variant="plain" onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
