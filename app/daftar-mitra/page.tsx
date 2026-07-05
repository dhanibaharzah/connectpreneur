import { DaftarMitraForm } from "@/components/daftar-mitra/daftar-mitra-form"
import { getDaftarPathsFromHeaders } from "@/lib/catalog/catalog-paths"

export default async function DaftarMitraPage() {
  const paths = await getDaftarPathsFromHeaders()
  return <DaftarMitraForm useMainSiteLinks={paths.onSubdomain} />
}
