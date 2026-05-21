"use client"

import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import AdminMembers from "@/components/admin/admin-members"

export default function AdminMembersPage() {
  return <AdminAuthGuard>{(user) => <AdminMembers user={user} />}</AdminAuthGuard>
}
