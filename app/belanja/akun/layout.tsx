import { BelanjaAkunLayout } from "@/components/belanja/belanja-akun-layout"
import { getBelanjaPathsFromHeaders } from "@/lib/marketplace/belanja-paths"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BelanjaAkunLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const paths = await getBelanjaPathsFromHeaders()

  return (
    <BelanjaAkunLayout homePath={paths.homePath} onSubdomain={paths.onSubdomain}>
      {children}
    </BelanjaAkunLayout>
  )
}
