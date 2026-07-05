# ConnectPreneur

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-connectpreneur.id-green?style=for-the-badge)](https://connectpreneur.id)

---

> Platform digital untuk katalog mitra bisnis, marketplace belanja UMKM, dan alur permintaan penawaran (RFQ) terintegrasi WhatsApp.

<p align="center">
  <a href="#-tentang-project">Tentang</a> •
  <a href="#-flow-sistem-business-perspective">Flow Sistem</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-fitur-utama">Fitur</a> •
  <a href="#-local-development">Setup</a> •
  <a href="#-deployment">Deploy</a> •
  <a href="#-api-endpoints">API</a>
</p>

---

## 📸 Screenshots

<details>
<summary>Klik untuk melihat screenshots</summary>

| Homepage | Katalog | Detail Bisnis |
|----------|---------|---------------|
| ![Homepage](https://via.placeholder.com/300x200?text=Homepage) | ![Katalog](https://via.placeholder.com/300x200?text=Katalog) | ![Detail](https://via.placeholder.com/300x200?text=Detail) |

| Admin Dashboard | Form Mitra | Daftar Mitra |
|-----------------|------------|--------------|
| ![Admin](https://via.placeholder.com/300x200?text=Admin) | ![Form](https://via.placeholder.com/300x200?text=Form) | ![Daftar](https://via.placeholder.com/300x200?text=Daftar+Mitra) |

</details>

## 📖 Tentang Project

**ConnectPreneur** adalah startup digital yang diinisiasi Perkumpulan Anak Muda Bandung, dengan keyakinan bahwa berwirausaha dapat memajukan ekonomi Indonesia. Platform ini bertujuan untuk:

- Menampilkan katalog mitra bisnis dengan berbagai peluang kemitraan
- Menghubungkan pelaku UMKM dengan calon mitra dan pembeli
- Memfasilitasi permintaan penawaran (RFQ) hingga invoice dan konfirmasi pembayaran
- Memperluas jangkauan bisnis melalui program Business Matching dan marketplace belanja

## 🎯 Masalah yang Diselesaikan

1. **Fragmentasi Informasi** — Menyatukan informasi peluang kemitraan dan produk UMKM dalam satu platform terpusat
2. **Akses Terbatas** — Membuka akses informasi kemitraan ke lebih banyak pelaku usaha di Indonesia
3. **Proses Manual** — Digitalisasi pendaftaran, verifikasi dokumen (OCR), dan alur transaksi RFQ
4. **Keterhubungan** — Memfasilitasi koneksi langsung antara pemilik bisnis, calon mitra, dan pembeli via WhatsApp

## 🔄 Flow Sistem (Business Perspective)

### Overview

ConnectPreneur menghubungkan empat aktor utama: **Pemilik Bisnis** (UMKM), **Pembeli/Pengunjung**, **Admin**, dan **Portal khusus** (Belanja & Mitra). Berikut alur sistem dari sisi bisnis:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         CONNECTPRENEUR FLOW                              │
│                                                                          │
│  ┌──────────┐   Daftar    ┌──────────┐  Verifikasi  ┌────────┐         │
│  │ Pemilik  │───────────▶│ Platform │◀─────────────│ Admin  │         │
│  │ Bisnis   │            │  (Web)   │   (manual/   │ Panel  │         │
│  └──────────┘            └────┬─────┘    OCR)      └────────┘         │
│                                 │                                        │
│                           Tampil di Katalog                              │
│                           + Marketplace Belanja                          │
│                                 │                                        │
│         ┌───────────────────────┼───────────────────────┐               │
│         ▼                       ▼                       ▼               │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐        │
│  │  Pengunjung │         │   Pembeli   │         │ Portal UMKM │        │
│  │ (Calon Mitra│         │  (Belanja)  │         │  (mitra.)   │        │
│  └──────┬──────┘         └──────┬──────┘         └──────┬──────┘        │
│         │                       │                       │               │
│    WA / RFQ              RFQ → Invoice            Kelola transaksi      │
│         │                       │                       │               │
│         └───────────────────────┴───────────────────────┘               │
│                                 │                                        │
│                          Kerjasama (offline)                             │
└──────────────────────────────────────────────────────────────────────────┘
```

### 1. Pendaftaran Bisnis (Self-Registration)

```
Pemilik Bisnis → Buka /daftar-mitra → Isi Form Multi-Tab → Submit
                                          │
                                          ├─ Info Dasar (nama, deskripsi, kategori, jenis peluang)
                                          ├─ Detail (alamat, lokasi Jawa Barat)
                                          ├─ Kontak (PIC, WhatsApp, sosial media)
                                          ├─ Legalitas (KTP wajib, Akta Pendirian, Legalitas PDF)
                                          └─ Gambar (logo, foto produk max 5)
                                          │
                                          ▼
                              OCR verifikasi KTP (+ Akta jika diupload)
                                          │
                                    ┌─────┴─────┐
                                    │           │
                              Lolos OCR    Perlu review
                                    │           │
                                    ▼           ▼
                            AUTO-APPROVE    PENDING (admin review)
                            (is_active=true)
```

- Pemilik bisnis mendaftar mandiri tanpa perlu akun
- **KTP wajib** diupload; Akta Pendirian opsional tapi mempengaruhi ConnectScore
- Verifikasi OCR otomatis (KTP & Akta) — jika lolos, bisnis langsung aktif
- Gambar otomatis dikompresi (~100KB) untuk efisiensi storage
- Notifikasi WhatsApp via GoWA setelah pendaftaran

### 2. Verifikasi oleh Admin

```
Admin Login → Mitra Bisnis → Lihat Daftar Pending → Review Data Bisnis
                                                        │
                                                  ┌─────┴─────┐
                                                  │           │
                                              Approve      Reject
                                                  │           │
                                                  ▼           ▼
                                          is_active=true   Ditolak/
                                          Tampil di        Dihapus
                                          Katalog
```

- Admin melakukan verifikasi kelengkapan & keabsahan data bisnis (khususnya jika OCR gagal)
- Akses admin dibatasi berdasarkan wilayah (Location-Based Access Control):

| Level Admin | Cakupan Akses |
|-------------|---------------|
| Superadmin | Seluruh bisnis tanpa batasan |
| Admin Kab/Kota (DPD) | Bisnis di kota tersebut + seluruh kecamatan di dalamnya |
| Admin Kecamatan (DPC) | Hanya bisnis di kecamatan tersebut |

- Admin baru dapat mendaftar via `/admin/signup` dan menunggu persetujuan superadmin

### 3. Katalog & Pencarian (Public)

```
Pengunjung → Homepage                → Lihat Featured Bisnis
           → Katalog (/katalog)      → Cari & Filter (nama, kategori, ConnectScore tier)
           → Detail Bisnis           → Lihat Profil, Produk, Galeri, ConnectScore
                                           │
                                    ┌──────┴──────┐
                                    ▼             ▼
                              Hubungi WA      Submit RFQ
```

- Pengunjung melihat katalog bisnis yang sudah terverifikasi
- Pencarian dan filter kategori + **ConnectScore Tier** (Unggulan, Berkualitas, Dasar, Wajib Perbaikan)
- Sort: default, nama A–Z, ConnectScore tertinggi
- Kontak langsung via WhatsApp atau ajukan **permintaan penawaran (RFQ)**

### 4. ConnectScore — Indikator Kelengkapan Profil

```
Profil Bisnis → Evaluasi 17 Aspek → Skor 0-100 → Tier Label
                    │
                    ├─ Deskripsi Bisnis (8 poin)
                    ├─ Logo (8 poin)
                    ├─ Akta Pendirian (10 poin)
                    ├─ Legalitas (7 poin)
                    ├─ Foto Produk (7-10 poin)
                    ├─ Sosial Media (Instagram 5, Facebook 3, TikTok 2)
                    ├─ Info Kemitraan, Lokasi, Kontak, dll
                    └─ Total: 100 poin
```

| Tier | Rentang | Label |
|------|---------|-------|
| Unggulan | 90–100 | UMKM Unggulan |
| Berkualitas | 70–89 | UMKM Berkualitas |
| Dasar | 60–69 (atau terverifikasi tanpa legalitas) | UMKM Dasar |
| Wajib Perbaikan | <60 atau tanpa akta & legalitas | Wajib Perbaikan |

- Skor di-cache di database untuk performa optimal
- UMKM dapat melengkapi legalitas via Portal UMKM (`/umkm`)

### 5. Alur Transaksi RFQ

```
Pembeli submit RFQ → pending_review
       │
       ▼ (UMKM approve via Portal Mitra)
   approved → UMKM kirim invoice → invoice_sent
       │
       ▼ (Pembeli upload bukti di /bayar/[token])
 payment_proof_uploaded → UMKM konfirmasi → completed (+ poin gamification)
```

**Status transaksi:** `pending_review` → `approved` → `invoice_sent` → `payment_proof_uploaded` → `completed` (atau `rejected` / `cancelled`)

- RFQ dapat diajukan dari halaman detail bisnis atau marketplace belanja
- Invoice publik via `/invoice/[token]`; upload bukti bayar via `/bayar/[token]`
- Notifikasi WhatsApp otomatis ke UMKM & pembeli (GoWA)
- Reminder pembayaran otomatis 72 jam setelah invoice (cron job)
- **Bukan payment gateway** — pembayaran dilakukan transfer bank offline; platform memfasilitasi invoice & bukti transfer

### 6. Marketplace Belanja & Portal

| Portal | URL | Fungsi |
|--------|-----|--------|
| Situs utama | [connectpreneur.id](https://connectpreneur.id) | Katalog mitra, detail bisnis, daftar mitra |
| Belanja | `belanja.connectpreneur.id` | Marketplace produk/jasa UMKM, akun pembeli |
| Mitra (UMKM) | `mitra.connectpreneur.id` | Dashboard transaksi, produk, pelanggan, QR toko |
| Admin | `admin.connectpreneur.id` | Analytics, mitra, transaksi, banner, anggota |

### 7. Ringkasan Alur End-to-End

```
PENDAFTARAN          VERIFIKASI           PUBLIKASI
───────────          ──────────           ─────────
Isi Form → Submit → OCR/Admin Review → Approve → Katalog + Belanja
  (5 tab)   (pending)   (by region)    (active)        │
                                                      │
DISCOVERY & RFQ                                       │
─────────────                                         │
Browse/Search/Belanja ◀─────────────────────────────┘
      │
      ▼
 Submit RFQ → Invoice → Bukti Bayar → Selesai (+ poin)
```

**Tidak ada:**
- Payment gateway online (Midtrans, dll.)
- Sistem pesan internal/chat in-app
- Matching otomatis / algoritma rekomendasi
- Subscription / fitur premium

Platform ini sepenuhnya **gratis** sebagai layanan digital ConnectPreneur untuk mendukung pertumbuhan UMKM.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://radix-ui.com/) |
| Database | [Neon PostgreSQL](https://neon.tech/) (Serverless) |
| File Storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) (`pub-*.r2.dev` atau subdomain custom); legacy [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) read-only |
| Image Processing | [Sharp](https://sharp.pixelplumbing.com/) (auto-compress) |
| OCR | OCR service eksternal + [Tesseract.js](https://tesseract.projectnaptha.com/) fallback |
| WhatsApp | GoWA (self-hosted WhatsApp gateway) |
| Authentication | JWT (jose) — Admin JWT, UMKM OTP session, Pembeli OTP session |
| Analytics | Custom event tracking + [Vercel Analytics](https://vercel.com/analytics) |
| Charts / Maps | [Recharts](https://recharts.org/) + [react-simple-maps](https://www.react-simple-maps.io/) |
| Testing | [Vitest](https://vitest.dev/) |
| Deployment | [Vercel](https://vercel.com/) |

## 🌐 Production URL

| Portal | URL |
|--------|-----|
| Main | [https://connectpreneur.id](https://connectpreneur.id) |
| Belanja | [https://belanja.connectpreneur.id](https://belanja.connectpreneur.id) |
| Mitra (UMKM) | [https://mitra.connectpreneur.id](https://mitra.connectpreneur.id) |
| Admin | [https://admin.connectpreneur.id](https://admin.connectpreneur.id) |

## ✨ Fitur Utama

### Katalog & Kemitraan (Publik)

- 📋 Katalog bisnis dengan filter kategori dan **ConnectScore tier**
- 🔍 Pencarian mitra (nama, jenis usaha, lokasi) + sort ConnectScore
- 📱 Detail bisnis multi-tab (produk, tentang, galeri, kontak, kemitraan)
- 📝 Form pendaftaran mitra self-registration (5 tab, upload KTP wajib)
- 🔎 Verifikasi OCR KTP & Akta + auto-approval jika lolos
- 📞 Integrasi WhatsApp untuk kontak langsung
- 📊 Analytics tracking (page view, klik WA/website/sosial, RFQ submit)
- ⭐ ConnectScore (0–100) dengan tier badge

### Marketplace Belanja (`belanja.`)

- 🛒 Katalog produk/jasa dari mitra UMKM aktif
- 🎠 Banner carousel (dikelola superadmin)
- 🔍 Filter: pencarian, tipe (produk/jasa), lokasi, sort harga/nama
- 📦 Halaman detail produk dengan RFQ
- ♾️ Infinite scroll / load more

### Portal Pembeli (`/belanja/akun`)

- 📱 Login OTP via nomor WhatsApp
- 📋 Riwayat transaksi RFQ dengan status
- 🧾 Link invoice & upload bukti bayar
- 🏆 Gamification: poin, badge (Pembeli Baru / Terverifikasi / Top Pembeli)
- 📈 Halaman riwayat poin (`/belanja/akun/poin`)

### Portal UMKM (`mitra.` / `/umkm`)

- 📱 Login OTP via nomor WhatsApp PIC bisnis
- 📋 Kelola transaksi RFQ (approve, reject, kirim invoice, konfirmasi bayar)
- 🔔 Reminder pembayaran manual ke pembeli
- 📦 CRUD produk/jasa (nama, deskripsi, gambar, harga, tipe)
- 👥 Daftar pelanggan dari transaksi selesai
- 🏦 Pengaturan rekening bank
- 📄 Upload & kelola dokumen legalitas (Akta, Legalitas)
- 🏆 Trust tier gamification (100% Selesai / UMKM Terpercaya / Bintang ConnectPreneur)
- 🖨️ Cetak QR toko (`/umkm/cetak-qr`) menuju katalog bisnis

### Halaman Transaksi Publik

- 🧾 `/invoice/[token]` — lihat & cetak invoice
- 💳 `/bayar/[token]` — upload bukti transfer

### Admin Panel (`admin.`)

- 🔐 Authentication JWT + CSRF; Basic Auth di subdomain admin
- 📊 Dashboard analytics (visitor, heatmap Jawa Barat, stat per mitra/kab-kota, klik WA)
- 🏢 CRUD mitra bisnis + verifikasi pending + featured + filter ConnectScore tier
- 📋 Monitoring transaksi (read-only) + export CSV
- 🎠 Manajemen banner belanja (superadmin)
- 👥 Manajemen anggota admin — approve/reject pendaftaran DPD/DPC (superadmin)
- 📝 Self-signup admin dengan scope lokasi (`/admin/signup`)
- 🏷️ Manajemen kategori bisnis
- 🖼️ Auto-compress gambar (max 1MB → ~100KB)

---

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) atau npm
- Akun [Neon](https://neon.tech/) untuk database
- Akun Cloudflare R2 untuk file storage
- (Opsional) GoWA untuk notifikasi WhatsApp
- (Opsional) OCR service eksternal untuk verifikasi dokumen

### 1. Clone Repository

```bash
git clone https://github.com/dhanibaharzah/connectpreneur.git
cd connectpreneur
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root project:

```env
# Database - Neon PostgreSQL
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BELANJA_PORTAL_URL="http://localhost:3000/belanja"
NEXT_PUBLIC_MITRA_PORTAL_URL="http://localhost:3000/umkm"

# Cloudflare R2
R2_ACCOUNT_ID="your-r2-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="connectpreneur-bucket-storage"
R2_PUBLIC_BASE_URL="https://pub-xxxxxxxx.r2.dev"
NEXT_PUBLIC_R2_PUBLIC_BASE_URL="https://pub-xxxxxxxx.r2.dev"

# Vercel Blob (legacy — hanya untuk hapus file lama)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"

# JWT Secret (generate: openssl rand -base64 32)
JWT_SECRET="your-secret-key-here"

# GoWA WhatsApp (opsional)
GOWA_URL="https://your-gowa-instance"
GOWA_BASIC_AUTH="username:password"
GOWA_DEVICE_ID="your-device-id"

# OCR service (opsional — fallback ke Tesseract lokal)
OCR_SERVICE_URL="https://your-ocr-service"
OCR_SERVICE_API_KEY="your-ocr-api-key"

# Cron payment reminders (production)
CRON_SECRET="your-cron-secret"

# Admin subdomain Basic Auth (opsional, production)
SIGNUP_BASIC_AUTH_USERNAME="admin"
SIGNUP_BASIC_AUTH_PASSWORD="your-password"
```

**Cloudflare R2 — dua URL berbeda:**

| Variabel | Contoh | Fungsi |
|----------|--------|--------|
| S3 API (otomatis dari `R2_ACCOUNT_ID`) | `https://....r2.cloudflarestorage.com` | Upload/delete dari server — **jangan** dipakai di `<img>` |
| `R2_PUBLIC_BASE_URL` | `https://pub-xxxxxxxx.r2.dev` | URL yang disimpan di DB & ditampilkan ke user |

**Cara mendapatkan env dari Vercel:**

```bash
vercel login
vercel link
vercel env pull .env.local
```

### 4. Setup Database

Jalankan migration SQL di Neon Console secara berurutan dari folder `/migrations`:

```
016-add-ktp-url.sql
017-add-ocr-verified-flags.sql
018-gamification.sql
019-business-products.sql
020-add-product-deskripsi.sql
021-add-product-image-url.sql
022-add-product-tipe-bisnis.sql
024-shop-banners.sql
025-add-product-slug.sql
```

> Migration dasar (001–015) diasumsikan sudah ada di database production. Untuk setup fresh, hubungi tim atau jalankan schema lengkap dari backup Neon.

Cek koneksi database:

```bash
pnpm db:check
```

Backfill data gamification (jika perlu):

```bash
pnpm db:backfill-gamification
```

### 5. Admin Management

#### Self-Signup via UI

1. Buka `/admin/signup` (atau `admin.connectpreneur.id/signup`)
2. Isi email, password, pilih peran DPD (kab/kota) atau DPC (kecamatan)
3. Superadmin approve via menu **Anggota** di admin panel

#### Role & Location-Based Access Control

| Role | Location | Akses |
|------|----------|-------|
| `superadmin` | NULL | Semua bisnis, banner, anggota |
| `admin` (DPD) | Kabupaten/Kota | Bisnis di kota tersebut + semua kecamatan di bawahnya |
| `admin` (DPC) | Kecamatan | Hanya bisnis di kecamatan tersebut |

### 6. Run Development Server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000)

Jalankan tests:

```bash
pnpm test
```

---

## 🚢 Deployment

### Deploy ke Vercel (Recommended)

1. Push ke GitHub
2. Import project di [Vercel Dashboard](https://vercel.com/new)
3. Set environment variables di Vercel (lihat daftar di atas)
4. Konfigurasi cron job untuk reminder pembayaran:
   - Path: `/api/cron/payment-reminders`
   - Schedule: sesuai kebutuhan (mis. setiap 6 jam)
   - Header: `Authorization: Bearer <CRON_SECRET>`
5. Deploy!

Setiap push ke `main` branch akan auto-deploy.

### Manual Deployment

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

```
connectpreneur/
├── app/                         # Next.js App Router
│   ├── admin/                  # Admin panel (dashboard, mitra, transaksi, banner, members)
│   ├── api/                    # API routes
│   │   ├── admin/              # Protected admin APIs
│   │   ├── analytics/          # Event tracking
│   │   ├── auth/               # Admin auth (login, logout, signup, me)
│   │   ├── belanja/            # Marketplace APIs
│   │   ├── businesses/         # Public business APIs
│   │   ├── categories/         # Category APIs
│   │   ├── cron/               # Scheduled jobs
│   │   ├── invoice/            # Public invoice token
│   │   ├── locations/          # Location APIs (Jawa Barat)
│   │   ├── pembeli/            # Buyer OTP & transactions
│   │   ├── register-mitra/     # Public registration + OCR verify
│   │   ├── rfq/                # RFQ submission
│   │   ├── transaksi/          # Payment proof upload
│   │   └── umkm/               # UMKM portal APIs
│   ├── belanja/                # Marketplace pages
│   ├── bisnis/[slug]/          # Business detail page
│   ├── bayar/[token]/          # Payment proof upload page
│   ├── daftar-mitra/           # Public registration page
│   ├── invoice/[token]/        # Public invoice page
│   ├── katalog/                # Business catalog page
│   ├── pembeli/                # Redirect to belanja/akun
│   └── umkm/                   # UMKM portal + cetak QR
├── components/                 # React components
│   ├── admin/                  # Admin-specific components
│   ├── analytics/              # Tracking components
│   ├── belanja/                # Marketplace UI
│   ├── business/               # Business detail UI
│   ├── daftar-mitra/           # Registration form tabs
│   ├── katalog/                # Catalog UI
│   ├── pembeli/                # Buyer account UI
│   ├── umkm/                   # UMKM portal UI
│   └── ui/                     # shadcn/ui components
├── lib/                        # Business logic & utilities
│   ├── admin/                  # Admin helpers
│   ├── analytics/              # Analytics queries & geo
│   ├── auth/                   # Session, OTP, admin API guards
│   ├── business/               # ConnectScore, form utils, catalog URL
│   ├── integrations/           # GoWA, OCR, storage (R2), NIK matching
│   ├── marketplace/            # Belanja products, banners, routing
│   ├── transactions/           # RFQ flow, tokens, queries
│   └── umkm/                   # UMKM customers, gamification, QR
├── migrations/                 # SQL migration files
├── types/                      # TypeScript types
├── middleware.ts               # Subdomain routing & Basic Auth
└── public/                     # Static assets
```

---

## 🔌 API Endpoints

### Public — Katalog & Registrasi

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/businesses` | List active businesses |
| GET | `/api/businesses/[slug]` | Get business detail |
| GET | `/api/categories` | List categories |
| GET | `/api/locations` | List kabupaten/kota (Jawa Barat) |
| GET | `/api/locations/[parentId]` | List kecamatan by kabupaten/kota |
| GET | `/api/locations/detail/[id]` | Get location detail |
| POST | `/api/register-mitra` | Submit mitra registration |
| POST | `/api/register-mitra/upload` | Upload image (public) |
| DELETE | `/api/register-mitra/upload/delete` | Delete uploaded file |
| POST | `/api/register-mitra/verify/ktp` | Verify KTP via OCR |
| POST | `/api/register-mitra/verify/akta` | Verify Akta via OCR |
| POST | `/api/rfq` | Submit permintaan penawaran |
| POST | `/api/analytics/track` | Track analytics event |
| GET | `/api/invoice/[token]` | Get invoice by token |
| GET | `/api/transaksi/bukti/[token]` | Get payment page data |
| POST | `/api/transaksi/bukti/[token]` | Upload bukti bayar |

### Public — Marketplace Belanja

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/belanja/products` | List marketplace products |
| GET | `/api/belanja/products/[slug]` | Product detail |
| GET | `/api/belanja/banners` | Active shop banners |
| GET | `/api/belanja/locations` | Filter locations |

### Pembeli (OTP session)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pembeli/otp/request` | Request OTP |
| POST | `/api/pembeli/otp/verify` | Verify OTP & login |
| POST | `/api/pembeli/logout` | Logout |
| GET | `/api/pembeli/me` | Current buyer profile |
| GET | `/api/pembeli/transactions` | Buyer transaction history |
| GET | `/api/pembeli/points` | Point ledger |

### UMKM Portal (OTP session)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/umkm/otp/request` | Request OTP |
| POST | `/api/umkm/otp/verify` | Verify OTP & login |
| GET | `/api/umkm/transactions` | List transactions |
| PATCH | `/api/umkm/transactions/[id]` | Update transaction status |
| GET | `/api/umkm/products` | List business products |
| POST | `/api/umkm/products` | Create product |
| PUT | `/api/umkm/products/[id]` | Update product |
| DELETE | `/api/umkm/products/[id]` | Delete product |
| GET | `/api/umkm/customers` | List customers |
| GET/PATCH | `/api/umkm/bank` | Get/update bank account |
| GET/PATCH | `/api/umkm/legalitas` | Get/update legalitas docs |
| GET | `/api/umkm/gamification` | Gamification stats |
| GET | `/api/umkm/qrcode` | Generate store QR data |

### Admin (JWT + CSRF)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| POST | `/api/auth/signup` | Admin self-registration |
| GET | `/api/auth/me` | Current admin user |
| GET | `/api/admin/businesses` | List businesses (location-scoped) |
| POST | `/api/admin/businesses` | Create business |
| PUT | `/api/admin/businesses/[id]` | Update business |
| DELETE | `/api/admin/businesses/[id]` | Delete business |
| POST | `/api/admin/upload` | Upload image |
| GET/POST | `/api/admin/categories` | List/create categories |
| PUT/DELETE | `/api/admin/categories/[id]` | Update/delete category |
| GET | `/api/admin/analytics` | Analytics dashboard data |
| GET | `/api/admin/transaksi` | List transactions (+ CSV export) |
| GET/POST | `/api/admin/banners` | List/create shop banners |
| PUT/DELETE | `/api/admin/banners/[id]` | Update/delete banner |
| GET/PATCH | `/api/admin/members` | List/approve admin members |

### Cron

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cron/payment-reminders` | Auto WhatsApp payment reminders (requires `CRON_SECRET`) |

---

## 💾 Storage Limits

Free tier considerations:

- **Cloudflare R2:** 10GB storage gratis
- **Image compression:** Auto-compress to ~100KB
- **Max upload gambar:** 1MB per file
- **Max upload PDF (legalitas):** 10MB per file

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

Private project — ConnectPreneur.

---

**ConnectPreneur** — *Startup Digital untuk Kemitraan Bisnis*
