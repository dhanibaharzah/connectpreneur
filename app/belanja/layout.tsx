import type { ReactNode } from "react"
import { PembeliAuthProvider } from "@/components/pembeli/pembeli-auth-context"

export default function BelanjaLayout({ children }: { children: ReactNode }) {
  return <PembeliAuthProvider>{children}</PembeliAuthProvider>
}
