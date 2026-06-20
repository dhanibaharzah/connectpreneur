import { BelanjaAkunClient } from "@/components/belanja/belanja-akun-client"
import { getBelanjaPathsFromHeaders } from "@/lib/marketplace/belanja-paths"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BelanjaAkunPage() {
  const paths = await getBelanjaPathsFromHeaders()

  return <BelanjaAkunClient homePath={paths.homePath} onSubdomain={paths.onSubdomain} />
}
