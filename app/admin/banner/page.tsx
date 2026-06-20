"use client"

import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import AdminBanners from "@/components/admin/admin-banners"

export default function AdminBannerPage() {
  return <AdminAuthGuard>{(user) => <AdminBanners user={user} />}</AdminAuthGuard>
}
