"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"

interface Location {
  id: number
  name: string
}

export default function AdminSignupPage() {
  const [step, setStep] = useState<"form" | "success">("form")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [roleType, setRoleType] = useState<"DPD" | "DPC" | "">("")
  const [kabKotaList, setKabKotaList] = useState<Location[]>([])
  const [kecamatanList, setKecamatanList] = useState<Location[]>([])
  const [selectedKabKota, setSelectedKabKota] = useState("")
  const [selectedKecamatan, setSelectedKecamatan] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingLocations, setLoadingLocations] = useState(true)

  useEffect(() => {
    async function loadKabKota() {
      try {
        const res = await fetch("/api/locations")
        const data = await res.json()
        setKabKotaList(data)
      } catch {
        setError("Gagal memuat data lokasi")
      } finally {
        setLoadingLocations(false)
      }
    }
    loadKabKota()
  }, [])

  useEffect(() => {
    if (!selectedKabKota) {
      setKecamatanList([])
      setSelectedKecamatan("")
      return
    }
    async function loadKecamatan() {
      try {
        const res = await fetch(`/api/locations/${selectedKabKota}`)
        const data = await res.json()
        setKecamatanList(data)
      } catch {
        setKecamatanList([])
      }
    }
    setSelectedKecamatan("")
    loadKecamatan()
  }, [selectedKabKota])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!roleType) {
      setError("Pilih tipe anggota (DPD/DPC)")
      return
    }
    if (password !== confirmPassword) {
      setError("Password tidak cocok")
      return
    }
    if (roleType === "DPD" && !selectedKabKota) {
      setError("Pilih Kabupaten/Kota")
      return
    }
    if (roleType === "DPC" && !selectedKecamatan) {
      setError("Pilih Kecamatan")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          password,
          roleType,
          locationId: roleType === "DPD" ? selectedKabKota : selectedKecamatan,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal")
        return
      }

      setStep("success")
    } catch (err) {
      console.error("Signup error:", err)
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logoconnectpreneur.png"
                alt="ConnectPreneur"
                width={150}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-xl">Pendaftaran Berhasil</CardTitle>
            <CardDescription>
              Silakan tunggu persetujuan dari Superadmin. Anda akan mendapatkan akses setelah akun diaktifkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-white hover:bg-primary/90"
            >
              Kembali ke Login
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logoconnectpreneur.png"
              alt="ConnectPreneur"
              width={150}
              height={60}
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-xl">Daftar Anggota</CardTitle>
          <CardDescription>Daftar sebagai DPD atau DPC untuk mengelola platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

            <div className="space-y-2">
              <Label>Tipe Anggota</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRoleType("DPD")
                    setSelectedKecamatan("")
                  }}
                  className={`p-3 rounded-md border-2 text-sm font-medium text-center transition ${
                    roleType === "DPD"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40"
                  }`}
                >
                  <div className="font-semibold">DPD</div>
                  <div className="text-xs font-normal mt-1">Kabupaten / Kota</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRoleType("DPC")
                    setSelectedKabKota("")
                    setSelectedKecamatan("")
                  }}
                  className={`p-3 rounded-md border-2 text-sm font-medium text-center transition ${
                    roleType === "DPC"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40"
                  }`}
                >
                  <div className="font-semibold">DPC</div>
                  <div className="text-xs font-normal mt-1">Kecamatan</div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@connectpreneur.id"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama (opsional)</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap"
              />
            </div>

            {roleType === "DPD" && (
              <div className="space-y-2">
                <Label htmlFor="kabKota">Kabupaten / Kota</Label>
                {loadingLocations ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat lokasi...
                  </div>
                ) : (
                  <select
                    id="kabKota"
                    value={selectedKabKota}
                    onChange={(e) => setSelectedKabKota(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Pilih Kabupaten / Kota</option>
                    {kabKotaList.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {roleType === "DPC" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="kabKotaDpc">Kabupaten / Kota</Label>
                  {loadingLocations ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memuat lokasi...
                    </div>
                  ) : (
                    <select
                      id="kabKotaDpc"
                      value={selectedKabKota}
                      onChange={(e) => setSelectedKabKota(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Pilih Kabupaten / Kota</option>
                      {kabKotaList.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {selectedKabKota && (
                  <div className="space-y-2">
                    <Label htmlFor="kecamatan">Kecamatan</Label>
                    <select
                      id="kecamatan"
                      value={selectedKecamatan}
                      onChange={(e) => setSelectedKecamatan(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Pilih Kecamatan</option>
                      {kecamatanList.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 karakter, huruf besar, kecil, dan angka"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                "Daftar"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Masuk
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
