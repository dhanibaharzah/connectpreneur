"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, LogOut, Star, StarOff, Loader2, CheckCircle, Clock, XCircle } from "lucide-react"
import BusinessFormModal from "./business-form-modal"

interface AdminUser {
  id: number
  email: string
  name: string | null
  role: string
}

interface Business {
  id: number
  nama: string
  slug: string
  logo_url: string | null
  category_name: string | null
  kota_provinsi: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

interface AdminDashboardProps {
  user: AdminUser
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "active">("all")
  const [pendingCount, setPendingCount] = useState(0)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingBusiness, setEditingBusiness] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Business | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchBusinesses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      })
      if (search) params.set("search", search)
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/admin/businesses?${params}`, {
        credentials: "include",
        headers: getAuthHeaders(),
      })
      const data = await res.json()

      if (res.ok && data.businesses) {
        setBusinesses(Array.isArray(data.businesses) ? data.businesses : [])
        setTotalPages(data.pagination?.totalPages || 1)
        if (data.pendingCount !== undefined) {
          setPendingCount(data.pendingCount)
        }
      } else {
        setBusinesses([])
        setTotalPages(1)
        console.error("Error fetching businesses:", data.error)
      }
    } catch (error) {
      console.error("Error fetching businesses:", error)
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [page, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchBusinesses()
  }

  const handleLogout = async () => {
    localStorage.removeItem("admin_token")
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    router.push("/admin/login")
  }

  const handleEdit = async (business: Business) => {
    try {
      const res = await fetch(`/api/admin/businesses/${business.id}`, {
        credentials: "include",
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (res.ok) {
        setEditingBusiness(data.business)
        setShowFormModal(true)
      }
    } catch (error) {
      console.error("Error fetching business:", error)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return

    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/businesses/${deleteConfirm.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      })

      if (res.ok) {
        fetchBusinesses()
        setDeleteConfirm(null)
      } else {
        const data = await res.json()
        alert(data.error || "Gagal menghapus bisnis")
      }
    } catch (error) {
      console.error("Error deleting business:", error)
      alert("Terjadi kesalahan")
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleFeatured = async (business: Business) => {
    try {
      const res = await fetch(`/api/admin/businesses/${business.id}`, {
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_featured: !business.is_featured }),
      })

      if (res.ok) {
        fetchBusinesses()
      }
    } catch (error) {
      console.error("Error toggling featured:", error)
    }
  }

  const handleToggleVerification = async (business: Business) => {
    try {
      const res = await fetch(`/api/admin/businesses/${business.id}`, {
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !business.is_active }),
      })

      if (res.ok) {
        fetchBusinesses()
      }
    } catch (error) {
      console.error("Error toggling verification:", error)
    }
  }

  const handleFormClose = () => {
    setShowFormModal(false)
    setEditingBusiness(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    fetchBusinesses()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logoconnectpreneur.png"
              alt="ConnectPreneur"
              width={120}
              height={48}
              className="h-10 w-auto"
            />
            <span className="text-sm text-muted-foreground">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Badge variant="outline">{user.role}</Badge>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Daftar Mitra Bisnis</h1>
              {pendingCount > 0 && (
                <p className="text-sm text-orange-600 mt-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {pendingCount} mitra menunggu verifikasi
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Cari bisnis..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64"
                />
                <Button type="submit" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <Button onClick={() => setShowFormModal(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Mitra
              </Button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => { setStatusFilter("all"); setPage(1) }}
            >
              Semua
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => { setStatusFilter("pending"); setPage(1) }}
              className={statusFilter === "pending" ? "" : "text-orange-600 border-orange-300 hover:bg-orange-50"}
            >
              <Clock className="h-4 w-4 mr-1" />
              Menunggu Verifikasi
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                  {pendingCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => { setStatusFilter("active"); setPage(1) }}
              className={statusFilter === "active" ? "" : "text-green-600 border-green-300 hover:bg-green-50"}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Terverifikasi
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Logo</TableHead>
                      <TableHead>Nama Bisnis</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead className="text-center">Featured</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="w-20">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {businesses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Belum ada data bisnis
                        </TableCell>
                      </TableRow>
                    ) : (
                      businesses.map((business) => (
                        <TableRow key={business.id}>
                          <TableCell>
                            {business.logo_url ? (
                              <Image
                                src={business.logo_url || "/placeholder.svg"}
                                alt={business.nama}
                                width={40}
                                height={40}
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground font-bold">
                                {business.nama.charAt(0)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{business.nama}</TableCell>
                          <TableCell>{business.category_name || "-"}</TableCell>
                          <TableCell>{business.kota_provinsi || "-"}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm" onClick={() => handleToggleFeatured(business)}>
                              {business.is_featured ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleVerification(business)}
                              className={business.is_active ? "text-green-600 hover:text-green-700" : "text-orange-600 hover:text-orange-700"}
                            >
                              {business.is_active ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Terverifikasi
                                </>
                              ) : (
                                <>
                                  <Clock className="h-4 w-4 mr-1" />
                                  Pending
                                </>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => window.open(`/bisnis/${business.slug}`, "_blank")}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Lihat
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(business)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {!business.is_active && (
                                  <DropdownMenuItem onClick={() => handleToggleVerification(business)} className="text-green-600">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Verifikasi
                                  </DropdownMenuItem>
                                )}
                                {business.is_active && (
                                  <DropdownMenuItem onClick={() => handleToggleVerification(business)} className="text-orange-600">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Batalkan Verifikasi
                                  </DropdownMenuItem>
                                )}
                                {user.role === "superadmin" && (
                                  <DropdownMenuItem onClick={() => setDeleteConfirm(business)} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hapus
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Sebelumnya
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Halaman {page} dari {totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Selanjutnya
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Form Modal */}
      {showFormModal && (
        <BusinessFormModal business={editingBusiness} onClose={handleFormClose} onSuccess={handleFormSuccess} />
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Bisnis</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Apakah Anda yakin ingin menghapus <strong>{deleteConfirm?.nama}</strong>? Tindakan ini tidak dapat
            dibatalkan dan akan menghapus semua gambar terkait.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
