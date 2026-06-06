"use client"

import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import TransaksiDashboard from "@/components/admin/transaksi-dashboard"

export default function AdminTransaksiPage() {
  return <AdminAuthGuard>{(user) => <TransaksiDashboard user={user} />}</AdminAuthGuard>
}
