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

**ConnectPreneur** adalah program Digital Ecosystem yang diinisiasi oleh BOEMKraf (Bidang Pemberdayaan UMKM, Ekonomi Kreatif & Korporasi). Platform ini bertujuan untuk:

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
```

Atau gunakan migration script:

```bash
pnpm tsx scripts/run-migration.ts
```

### 5. Run Development Server

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
├── scripts/              # Database scripts
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
| POST | `/api/register-mitra` | Submit new mitra registration |
| POST | `/api/register-mitra/upload` | Upload image (public) |

### Admin (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/admin/businesses` | List all businesses |
| POST | `/api/admin/businesses` | Create business |
| PUT | `/api/admin/businesses/[id]` | Update business |
| DELETE | `/api/admin/businesses/[id]` | Delete business |
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
