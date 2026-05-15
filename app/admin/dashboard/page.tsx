"use client"

import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import AnalyticsDashboard from "@/components/admin/analytics-dashboard"

export default function AdminDashboardPage() {
  return <AdminAuthGuard>{(user) => <AnalyticsDashboard user={user} />}</AdminAuthGuard>
}
