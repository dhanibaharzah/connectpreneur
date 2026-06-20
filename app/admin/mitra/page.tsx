"use client"

import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import AdminMitraDashboard from "@/components/admin/admin-mitra-dashboard"

export default function AdminMitraPage() {
  return <AdminAuthGuard>{(user) => <AdminMitraDashboard user={user} />}</AdminAuthGuard>
}
