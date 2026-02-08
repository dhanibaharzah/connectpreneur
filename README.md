# ConnectPreneur

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-connectpreneur.id-green?style=for-the-badge)](https://connectpreneur.id)

---

> Platform katalog bisnis digital yang menghubungkan pelaku UMKM dengan berbagai peluang kemitraan bisnis.

<p align="center">
  <a href="#-tentang-project">Tentang</a> •
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

**ConnectPreneur** adalah program Digital Ecosystem yang diinisiasi oleh BOEMKraf. Platform ini bertujuan untuk:

- Menampilkan katalog mitra bisnis dengan berbagai peluang kemitraan
- Menghubungkan pelaku UMKM dengan calon mitra (reseller, agen, dropshipper, franchise, dll)
- Memperluas jangkauan bisnis anggota melalui program Business Matching internal

## 🎯 Masalah yang Diselesaikan

1. **Fragmentasi Informasi** - Menyatukan informasi peluang kemitraan dalam satu platform terpusat
2. **Akses Terbatas** - Membuka akses informasi kemitraan ke puluhan ribu anggota BOEMKraf
3. **Proses Manual** - Digitalisasi proses pendaftaran dan verifikasi mitra bisnis
4. **Keterhubungan** - Memfasilitasi koneksi langsung antara pemilik bisnis dan calon mitra

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://radix-ui.com/) |
| Database | [Neon PostgreSQL](https://neon.tech/) (Serverless) |
| Image Storage | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| Image Processing | [Sharp](https://sharp.pixelplumbing.com/) (auto-compress) |
| Authentication | JWT (jose) |
| Deployment | [Vercel](https://vercel.com/) |

## 🌐 Production URL

**Live:** [https://connectpreneur.id](https://connectpreneur.id)

## ✨ Fitur Utama

### Public
- 📋 Katalog bisnis dengan filter kategori
- 🔍 Pencarian mitra bisnis
- 📱 Detail bisnis dengan carousel gambar
- 📝 Form pendaftaran mitra (self-registration)
- 📞 Integrasi WhatsApp untuk kontak langsung

### Admin Panel (`/admin`)
- 🔐 Authentication dengan JWT
- 📊 Dashboard manajemen mitra
- ✅ Verifikasi pendaftaran mitra baru
- ✏️ CRUD bisnis dengan upload gambar
- 🖼️ Auto-compress gambar (max 1MB → ~100KB)
- ⭐ Featured business management

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) atau npm
- Akun [Neon](https://neon.tech/) untuk database
- Akun [Vercel](https://vercel.com/) untuk Blob storage

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

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"

# JWT Secret (generate: openssl rand -base64 32)
JWT_SECRET="your-secret-key-here"
```

**Cara mendapatkan env dari Vercel:**
```bash
vercel login
vercel link
vercel env pull .env.local
```

### 4. Setup Database

Jalankan migration scripts di Neon Console atau via script:

```bash
# Jalankan SQL scripts di folder /scripts secara berurutan:
# 001-create-tables.sql
# 002-seed-categories.sql
# 003-seed-businesses.sql (optional sample data)
# 004-seed-product-images.sql (optional)
# 005-add-jenis-peluang.sql
# 006-create-locations.sql
# 007-seed-locations.sql (data lokasi Jawa Barat)
# 008-add-location-to-businesses.sql
# 009-add-location-to-admin-users.sql
```

Atau gunakan migration script:

```bash
pnpm tsx scripts/run-migration.ts
```

### 5. Admin Management

#### Tambah Admin Baru

```bash
# Mode interaktif (input dari terminal)
npx tsx scripts/add-admin.ts

# Dengan argumen langsung
npx tsx scripts/add-admin.ts --email admin@example.com --name "Nama Admin" --password "Password123" --role admin

# Dengan location scope (akses terbatas per wilayah)
npx tsx scripts/add-admin.ts --email dpd.bekasi@connectpreneur.id --password "Password123" --role admin --location "Kota Bekasi"
npx tsx scripts/add-admin.ts --email dpd.kab.bekasi@connectpreneur.id --password "Password123" --role admin --location "Kab. Bekasi"
npx tsx scripts/add-admin.ts --email bekasi.mustikajaya@connectpreneur.id --password "Password123" --role admin --location "Mustikajaya"
```

**Opsi:**
- `--email` - Alamat email (wajib)
- `--name` - Nama tampilan (opsional)
- `--password` - Password minimal 8 karakter, harus ada huruf besar, kecil, dan angka
- `--role` - `admin` atau `superadmin` (default: admin)
- `--location` - Nama lokasi untuk scope akses (opsional, contoh: "Kota Bekasi", "Mustikajaya")

#### Role & Location-Based Access Control

| Role | Location | Akses |
|------|----------|-------|
| `superadmin` | NULL | Semua bisnis |
| `admin` | Kabupaten/Kota (contoh: Kota Bekasi) | Bisnis di kota tersebut + semua kecamatan di bawahnya |
| `admin` | Kecamatan (contoh: Mustikajaya) | Hanya bisnis di kecamatan tersebut |

**Contoh:**
- `superadmin@connectpreneur.id` → akses seluruh bisnis
- `dpd.bekasi@connectpreneur.id` (Kota Bekasi) → bisnis di Kota Bekasi + semua kecamatan di Kota Bekasi
- `dpd.kab.bekasi@connectpreneur.id` (Kab. Bekasi) → bisnis di Kab. Bekasi + semua kecamatan di Kab. Bekasi
- `dpc.mustikajaya@connectpreneur.id` (Mustikajaya) → hanya bisnis di Kecamatan Mustikajaya

#### Lihat Daftar Admin

```bash
npx tsx scripts/list-admins.ts
```

#### Kelola Admin

```bash
# Reset password
npx tsx scripts/manage-admin.ts --email admin@example.com --reset-password "PasswordBaru123"

# Ubah role
npx tsx scripts/manage-admin.ts --email admin@example.com --role superadmin

# Set location scope
npx tsx scripts/manage-admin.ts --email dpd.bekasi@connectpreneur.id --set-location "Kota Bekasi"

# Hapus location scope (grant full access)
npx tsx scripts/manage-admin.ts --email admin@example.com --remove-location

# Nonaktifkan akun
npx tsx scripts/manage-admin.ts --email admin@example.com --deactivate

# Aktifkan akun
npx tsx scripts/manage-admin.ts --email admin@example.com --activate

# Hapus akun
npx tsx scripts/manage-admin.ts --email admin@example.com --delete
```

### 6. Run Development Server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

### Deploy ke Vercel (Recommended)

1. Push ke GitHub
2. Import project di [Vercel Dashboard](https://vercel.com/new)
3. Set environment variables di Vercel:
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`
   - `JWT_SECRET`
4. Deploy!

Setiap push ke `main` branch akan auto-deploy.

### Manual Deployment

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
connectpreneur/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   │   ├── admin/         # Protected admin APIs
│   │   ├── auth/          # Authentication APIs
│   │   ├── businesses/    # Public business APIs
│   │   ├── categories/    # Category APIs
│   │   ├── locations/     # Location APIs (kabupaten/kota, kecamatan)
│   │   └── register-mitra/# Public registration API
│   ├── bisnis/[slug]/     # Business detail page
│   ├── daftar-mitra/      # Public registration page
│   └── katalog/           # Business catalog page
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities
│   ├── auth.ts           # Authentication helpers
│   ├── db.ts             # Database queries
│   └── utils.ts          # General utilities
├── scripts/              # Database & admin scripts
│   ├── add-admin.ts     # Tambah admin baru
│   ├── list-admins.ts   # Lihat daftar admin
│   ├── manage-admin.ts  # Kelola admin (reset password, dll)
│   └── *.sql            # Database migrations
├── public/               # Static assets
└── types/                # TypeScript types
```

## 🔌 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/businesses` | List all active businesses |
| GET | `/api/businesses/[slug]` | Get business detail |
| GET | `/api/categories` | List all categories |
| GET | `/api/locations` | List kabupaten/kota (Jawa Barat) |
| GET | `/api/locations/[parentId]` | List kecamatan by kabupaten/kota |
| GET | `/api/locations/detail/[id]` | Get location detail |
| POST | `/api/register-mitra` | Submit new mitra registration |
| POST | `/api/register-mitra/upload` | Upload image (public) |

### Admin (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/me` | Get current user (incl. location_id) |
| GET | `/api/admin/businesses` | List businesses (filtered by admin location scope) |
| POST | `/api/admin/businesses` | Create business |
| PUT | `/api/admin/businesses/[id]` | Update business (location access check) |
| DELETE | `/api/admin/businesses/[id]` | Delete business (location access check) |
| POST | `/api/admin/upload` | Upload image (admin) |

## 💾 Storage Limits

Free tier considerations:
- **Vercel Blob:** 1GB/month
- **Image compression:** Auto-compress to ~100KB
- **Max upload:** 1MB per image
- **Estimated capacity:** ~50 mitra/day × 6 images × 30 days

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Private project for BOEMKraf.

---

**BOEMKraf** - *Kreatif, Kolaboratif, Berdaya!*
