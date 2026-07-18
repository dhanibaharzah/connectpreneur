export type PanduanSection = "buyer" | "mitra" | "katalog" | "belanja"

export interface PanduanStep {
  title: string
  description: string
  tips?: string[]
  /** Path relatif ke /public — ganti file ini saat screenshot sudah siap */
  screenshotPath: string
  screenshotAlt: string
}

export interface PanduanGuide {
  id: PanduanSection
  label: string
  headline: string
  intro: string
  steps: PanduanStep[]
}

export const PANDUAN_SECTIONS: PanduanSection[] = ["buyer", "mitra", "katalog", "belanja"]

export function isPanduanSection(value: string | undefined): value is PanduanSection {
  return PANDUAN_SECTIONS.includes(value as PanduanSection)
}

export const PANDUAN_GUIDES: PanduanGuide[] = [
  {
    id: "buyer",
    label: "Buyer",
    headline: "Panduan Pembeli",
    intro:
      "Panduan ini untuk Anda yang ingin membeli produk atau jasa dari mitra UMKM di ConnectPreneur. Anda tidak perlu mendaftar dulu untuk melihat katalog — cukup login saat akan mengajukan permintaan penawaran.",
    steps: [
      {
        title: "Buka marketplace Belanja",
        description:
          "Kunjungi halaman Belanja ConnectPreneur untuk melihat produk dan jasa dari mitra UMKM yang sudah terverifikasi. Anda bisa mulai dari menu Belanja di situs utama atau langsung ke belanja.connectpreneur.id.",
        screenshotPath: "/images/panduan/buyer/01-belanja-home.png",
        screenshotAlt: "Halaman utama marketplace Belanja ConnectPreneur",
      },
      {
        title: "Cari produk atau jasa",
        description:
          "Gunakan kolom pencarian di bagian atas, atau filter berdasarkan tipe (produk/jasa), lokasi, dan urutan harga. Klik kartu produk untuk melihat detail lengkap.",
        tips: [
          "Harga yang ditampilkan adalah harga mulai — harga final bisa berbeda setelah negosiasi dengan mitra.",
        ],
        screenshotPath: "/images/panduan/buyer/02-cari-produk.png",
        screenshotAlt: "Pencarian dan filter produk di Belanja",
      },
      {
        title: "Ajukan permintaan penawaran (RFQ)",
        description:
          "Di halaman detail produk atau profil bisnis, klik tombol untuk mengajukan permintaan penawaran. Isi nama, nomor WhatsApp, kuantitas, dan catatan kebutuhan Anda.",
        screenshotPath: "/images/panduan/buyer/03-form-rfq.png",
        screenshotAlt: "Form permintaan penawaran RFQ",
      },
      {
        title: "Verifikasi nomor WhatsApp",
        description:
          "Setelah mengisi form, Anda akan diminta verifikasi OTP via WhatsApp. Masukkan kode yang dikirim ke nomor Anda. Verifikasi ini memastikan mitra dapat menghubungi Anda.",
        screenshotPath: "/images/panduan/buyer/04-verifikasi-otp.png",
        screenshotAlt: "Langkah verifikasi OTP pembeli",
      },
      {
        title: "Tunggu konfirmasi dari mitra",
        description:
          "Permintaan Anda masuk ke dashboard mitra dengan status \"Menunggu Review\". Mitra akan meninjau pesanan dan menyetujui atau menolak permintaan. Anda akan mendapat notifikasi via WhatsApp.",
        screenshotPath: "/images/panduan/buyer/05-menunggu-review.png",
        screenshotAlt: "Status transaksi menunggu review",
      },
      {
        title: "Terima invoice dan lakukan pembayaran",
        description:
          "Jika disetujui, mitra akan mengirim invoice berisi rincian harga dan rekening tujuan. Buka link invoice, lakukan transfer bank, lalu upload bukti pembayaran melalui link yang disediakan.",
        tips: [
          "ConnectPreneur bukan payment gateway — pembayaran dilakukan transfer langsung ke rekening mitra.",
          "Simpan bukti transfer sebelum upload.",
        ],
        screenshotPath: "/images/panduan/buyer/06-invoice-bayar.png",
        screenshotAlt: "Halaman invoice dan upload bukti bayar",
      },
      {
        title: "Pantau transaksi di Akun Saya",
        description:
          "Login ke Akun Saya untuk melihat semua transaksi, status terkini, link invoice, dan riwayat poin. Anda juga bisa melihat badge pembeli dan poin yang terkumpul dari transaksi selesai.",
        screenshotPath: "/images/panduan/buyer/07-akun-saya.png",
        screenshotAlt: "Dashboard akun pembeli",
      },
    ],
  },
  {
    id: "mitra",
    label: "Mitra",
    headline: "Panduan Mitra UMKM",
    intro:
      "Panduan ini untuk pemilik bisnis UMKM yang ingin bergabung di ConnectPreneur, menerima permintaan penawaran, dan mengelola toko online melalui Portal Mitra.",
    steps: [
      {
        title: "Daftarkan bisnis Anda",
        description:
          "Buka daftar.connectpreneur.id dan isi form 5 tab: info dasar, detail alamat & lokasi, kontak PIC, legalitas (KTP wajib), dan foto produk. Upload KTP dan dokumen pendukung untuk verifikasi.",
        tips: [
          "Jika verifikasi OCR KTP (dan Akta jika diupload) berhasil, bisnis Anda langsung aktif tanpa menunggu admin.",
          "Lengkapi profil semaksimal mungkin untuk ConnectScore lebih tinggi.",
        ],
        screenshotPath: "/images/panduan/mitra/01-daftar-mitra.png",
        screenshotAlt: "Form pendaftaran mitra ConnectPreneur",
      },
      {
        title: "Masuk ke Portal Mitra",
        description:
          "Setelah terdaftar, buka mitra.connectpreneur.id atau menu Portal UMKM. Login menggunakan nomor WhatsApp PIC yang didaftarkan. Masukkan OTP yang dikirim via WhatsApp.",
        screenshotPath: "/images/panduan/mitra/02-login-portal.png",
        screenshotAlt: "Login OTP Portal Mitra",
      },
      {
        title: "Perbarui profil bisnis",
        description:
          "Buka tab Pengaturan, lalu isi bagian Profil Bisnis. Anda bisa mengubah info dasar (nama, deskripsi, kategori), detail (alamat, lokasi, kemitraan, website), kontak PIC & sosial media, serta logo dan gambar carousel. Simpan setelah selesai.",
        tips: [
          "Status Featured dan Aktif hanya bisa diubah admin — slug URL juga tidak bisa diubah sendiri.",
          "Nomor WhatsApp PIC dipakai untuk login portal; pastikan tetap aktif jika diganti.",
        ],
        screenshotPath: "/images/panduan/mitra/08-edit-profil.png",
        screenshotAlt: "Form edit profil bisnis di Portal Mitra",
      },
      {
        title: "Kelola permintaan penawaran",
        description:
          "Di tab Transaksi, tinjau permintaan masuk. Anda dapat menyetujui, menolak (dengan alasan), mengirim invoice, mengirim reminder pembayaran, dan mengonfirmasi setelah pembeli upload bukti bayar.",
        screenshotPath: "/images/panduan/mitra/03-kelola-transaksi.png",
        screenshotAlt: "Panel transaksi di Portal Mitra",
      },
      {
        title: "Atur rekening bank",
        description:
          "Sebelum mengirim invoice, lengkapi data rekening bank di tab Pengaturan. Informasi ini akan muncul di invoice agar pembeli tahu tujuan transfer.",
        screenshotPath: "/images/panduan/mitra/04-rekening-bank.png",
        screenshotAlt: "Form rekening bank mitra",
      },
      {
        title: "Kelola produk & jasa",
        description:
          "Di tab Produk, tambahkan produk atau jasa yang ingin ditampilkan di marketplace Belanja dan halaman profil bisnis. Isi nama, deskripsi, harga mulai, tipe, dan foto produk.",
        screenshotPath: "/images/panduan/mitra/05-kelola-produk.png",
        screenshotAlt: "Manajemen produk mitra",
      },
      {
        title: "Lengkapi legalitas & ConnectScore",
        description:
          "Upload Akta Pendirian dan dokumen legalitas lain di tab Pengaturan untuk meningkatkan ConnectScore dan tier bisnis Anda (Unggulan, Berkualitas, dll.).",
        screenshotPath: "/images/panduan/mitra/06-legalitas.png",
        screenshotAlt: "Upload dokumen legalitas mitra",
      },
      {
        title: "Cetak QR toko",
        description:
          "Gunakan fitur Cetak QR untuk mendapatkan sticker QR code menuju halaman profil bisnis Anda. Tempel di toko fisik agar pelanggan bisa langsung melihat katalog dan produk Anda.",
        screenshotPath: "/images/panduan/mitra/07-cetak-qr.png",
        screenshotAlt: "Halaman cetak QR code toko",
      },
    ],
  },
  {
    id: "katalog",
    label: "Katalog",
    headline: "Panduan Katalog Bisnis",
    intro:
      "Panduan ini untuk pengunjung yang ingin menemukan mitra bisnis, mempelajari peluang kemitraan, atau menghubungi UMKM langsung melalui katalog ConnectPreneur.",
    steps: [
      {
        title: "Buka halaman Katalog",
        description:
          "Kunjungi katalog.connectpreneur.id untuk melihat daftar mitra bisnis yang sudah terverifikasi dan aktif. Anda juga bisa mengaksesnya dari menu Katalog di beranda connectpreneur.id.",
        screenshotPath: "/images/panduan/katalog/01-halaman-katalog.png",
        screenshotAlt: "Halaman katalog bisnis ConnectPreneur",
      },
      {
        title: "Cari dan filter mitra",
        description:
          "Gunakan kolom pencarian untuk mencari nama usaha, jenis usaha, atau lokasi. Filter berdasarkan kategori bisnis dan tier ConnectScore (Unggulan, Berkualitas, Dasar, Wajib Perbaikan). Urutkan berdasarkan nama atau ConnectScore tertinggi.",
        tips: [
          "Tier Unggulan dan Berkualitas menandakan profil bisnis lebih lengkap dan terverifikasi.",
        ],
        screenshotPath: "/images/panduan/katalog/02-cari-filter.png",
        screenshotAlt: "Filter dan pencarian katalog",
      },
      {
        title: "Pelajari profil bisnis",
        description:
          "Klik kartu bisnis untuk membuka halaman detail. Di sini Anda bisa melihat tab Produk & Layanan, Tentang Kami, Galeri, Informasi Usaha, Kontak, dan Program Kemitraan.",
        screenshotPath: "/images/panduan/katalog/03-detail-bisnis.png",
        screenshotAlt: "Halaman detail profil bisnis",
      },
      {
        title: "Pahami ConnectScore",
        description:
          "Setiap bisnis memiliki skor 0–100 yang menunjukkan kelengkapan profil: deskripsi, logo, dokumen legal, foto produk, sosial media, dan info kemitraan. Skor tinggi = profil lebih kredibel.",
        screenshotPath: "/images/panduan/katalog/04-connect-score.png",
        screenshotAlt: "Badge ConnectScore dan tier bisnis",
      },
      {
        title: "Hubungi langsung via WhatsApp",
        description:
          "Jika Anda tertarik menjadi reseller, agen, dropshipper, atau mitra franchise, gunakan tombol WhatsApp di profil bisnis untuk menghubungi PIC langsung dan mulai negosiasi.",
        screenshotPath: "/images/panduan/katalog/05-hubungi-wa.png",
        screenshotAlt: "Tombol hubungi WhatsApp di profil bisnis",
      },
      {
        title: "Ajukan permintaan penawaran",
        description:
          "Alternatif dari WhatsApp langsung: klik ajukan permintaan penawaran (RFQ) dari halaman profil bisnis. Alur ini tercatat di sistem dan memudahkan pembeli/mitra melacak status hingga invoice.",
        screenshotPath: "/images/panduan/katalog/06-ajukan-rfq.png",
        screenshotAlt: "Form RFQ dari halaman bisnis",
      },
      {
        title: "Ingin bergabung sebagai mitra?",
        description:
          "Jika Anda pemilik bisnis dan ingin tampil di katalog, buka daftar.connectpreneur.id. Proses pendaftaran gratis dan profil Anda akan tampil setelah verifikasi.",
        screenshotPath: "/images/panduan/katalog/07-daftar-mitra-cta.png",
        screenshotAlt: "Tombol daftar mitra",
      },
    ],
  },
  {
    id: "belanja",
    label: "Belanja",
    headline: "Panduan Marketplace Belanja",
    intro:
      "Belanja ConnectPreneur adalah marketplace produk dan jasa dari mitra UMKM terverifikasi. Panduan ini menjelaskan cara menemukan produk, membandingkan penawaran, dan memulai pembelian.",
    steps: [
      {
        title: "Apa itu Belanja ConnectPreneur?",
        description:
          "Belanja adalah marketplace khusus produk/jasa UMKM ConnectPreneur — berbeda dari Katalog yang fokus pada profil kemitraan bisnis. Di sini Anda bisa browsing produk siap beli dan mengajukan penawaran resmi.",
        screenshotPath: "/images/panduan/belanja/01-tentang-belanja.png",
        screenshotAlt: "Overview marketplace Belanja",
      },
      {
        title: "Jelajahi banner dan produk unggulan",
        description:
          "Halaman utama menampilkan banner promo dan grid produk dari berbagai mitra. Scroll untuk melihat lebih banyak, atau gunakan tombol muat lebih banyak di bagian bawah.",
        screenshotPath: "/images/panduan/belanja/02-banner-produk.png",
        screenshotAlt: "Banner dan grid produk Belanja",
      },
      {
        title: "Filter sesuai kebutuhan",
        description:
          "Gunakan filter tipe (Semua / Produk / Jasa), lokasi kabupaten/kota, dan urutan (terbaru, harga terendah/tertinggi, nama A–Z) untuk menemukan penawaran yang paling relevan.",
        screenshotPath: "/images/panduan/belanja/03-filter.png",
        screenshotAlt: "Filter marketplace Belanja",
      },
      {
        title: "Lihat detail produk",
        description:
          "Klik produk untuk melihat foto, deskripsi, harga mulai, tipe bisnis, lokasi mitra, dan profil singkat penjual. Dari sini Anda bisa lanjut ke profil bisnis lengkap.",
        screenshotPath: "/images/panduan/belanja/04-detail-produk.png",
        screenshotAlt: "Halaman detail produk Belanja",
      },
      {
        title: "Ajukan penawaran dari produk",
        description:
          "Klik tombol permintaan penawaran, isi data Anda, verifikasi OTP WhatsApp, dan tunggu mitra merespons. Proses selanjutnya sama dengan panduan Buyer (invoice → bayar → selesai).",
        screenshotPath: "/images/panduan/belanja/05-rfq-produk.png",
        screenshotAlt: "RFQ dari halaman produk",
      },
      {
        title: "Masuk ke Akun Saya",
        description:
          "Klik ikon Masuk di header Belanja untuk login dengan OTP WhatsApp. Setelah masuk, kelola semua transaksi, buka invoice, upload bukti bayar, dan lihat poin Anda.",
        screenshotPath: "/images/panduan/belanja/06-akun-pembeli.png",
        screenshotAlt: "Login dan akun pembeli di Belanja",
      },
      {
        title: "Ingin jualan di Belanja?",
        description:
          "Hanya mitra ConnectPreneur yang sudah terdaftar dan aktif yang bisa menampilkan produk. Daftar bisnis Anda dulu di daftar.connectpreneur.id, lalu kelola produk melalui Portal Mitra.",
        screenshotPath: "/images/panduan/belanja/07-jadi-penjual.png",
        screenshotAlt: "CTA daftar mitra untuk penjual",
      },
    ],
  },
]

export function getPanduanGuide(id: PanduanSection): PanduanGuide {
  return PANDUAN_GUIDES.find((g) => g.id === id) ?? PANDUAN_GUIDES[0]
}
