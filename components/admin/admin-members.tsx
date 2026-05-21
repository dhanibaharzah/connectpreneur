"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Users, Clock, Ban, Search } from "lucide-react"
import AdminShell, { getAdminAuthHeaders, type AdminUser } from "./admin-shell"

interface Member {
  id: number
  email: string
  name: string | null
  role: string
  location_id: number | null
  location_name: string | null
  location_level: string | null
  is_active: boolean
  created_at: string
}

interface AdminMembersProps {
  user: AdminUser
}

export default function AdminMembers({ user }: AdminMembersProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const loadMembers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/members", {
        credentials: "include",
        headers: getAdminAuthHeaders(),
      })
      if (res.ok) {
        const data = await res.json()
        setMembers(data.members)
      }
    } catch {
      console.error("Failed to load members")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const handleAction = async (id: number, action: "approve" | "reject" | "revoke") => {
    setActionLoading(id)
    try {
      await fetch("/api/admin/members", {
        method: "PATCH",
        credentials: "include",
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({ id, action }),
      })
      loadMembers()
    } catch {
      console.error("Action failed")
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = members.filter((m) => {
    if (!search) return true
    const q = search.toLowerCase()
    return m.email.toLowerCase().includes(q) || (m.name || "").toLowerCase().includes(q)
  })
  const pendingMembers = filtered.filter((m) => !m.is_active)
  const activeMembers = filtered.filter((m) => m.is_active)

  const getMemberType = (level: string | null) => {
    if (level === "kabupaten_kota") return "DPD"
    if (level === "kecamatan") return "DPC"
    return level || "—"
  }

  if (user.role !== "superadmin") {
    return (
      <AdminShell user={user}>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Hanya Superadmin yang dapat mengakses halaman ini.</p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell user={user}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Anggota</h1>
            {pendingMembers.length > 0 && (
              <p className="text-sm text-orange-600 mt-1">
                <Clock className="h-4 w-4 inline mr-1" />
                {pendingMembers.length} anggota menunggu persetujuan
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Total: {members.length}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Belum ada anggota terdaftar</div>
        ) : (
          <>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Tanggal Daftar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-40">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...pendingMembers, ...activeMembers].map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.email}</TableCell>
                      <TableCell>{member.name || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getMemberType(member.location_level)}</Badge>
                      </TableCell>
                      <TableCell>{member.location_name || "Semua Lokasi"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(member.created_at).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {member.is_active ? (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                            <Clock className="h-3 w-3 mr-1" />
                            Menunggu
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!member.is_active && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                              onClick={() => handleAction(member.id, "reject")}
                              disabled={actionLoading === member.id}
                            >
                              {actionLoading === member.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              Tolak
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAction(member.id, "approve")}
                              disabled={actionLoading === member.id}
                            >
                              {actionLoading === member.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              Setujui
                            </Button>
                          </div>
                        )}
                        {member.is_active && member.id !== user.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-400"
                            onClick={() => handleAction(member.id, "revoke")}
                            disabled={actionLoading === member.id}
                          >
                            {actionLoading === member.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Ban className="h-3 w-3" />
                            )}
                            Revoke
                          </Button>
                        )}
                        {member.is_active && member.id === user.id && (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
