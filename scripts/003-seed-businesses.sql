-- Seed data untuk businesses
-- Mendapatkan category IDs terlebih dahulu

INSERT INTO businesses (slug, nama, deskripsi, lama_usaha, alamat, kota_provinsi, jumlah_cabang, logo_url, link_galeri, website, instagram, facebook, tiktok, category_id, deskripsi_kemitraan, link_kemitraan, nama_pic, jabatan_pic, kontak_pic, is_featured)
VALUES
  -- Bandeng Presto ISRAFOOD
  ('bandeng-presto-israfood', 'Bandeng Presto ISRAFOOD', 'Frozen Food / bandeng presto dan olahan ikan lainya, dengan olahan khas Jawa Barat', '10 tahun (2015-2025)', 'Jalan raya Cilamaya No 04 Kp Dadut Utara RT01 RW07 desa Jayamukti kec Banyusari kab Karawang', 'Karawang, Jawa Barat', '2', '/images/israfood-logo.jpg', 'https://www.instagram.com/israfoodofficial', '', 'https://instagram.com/israfoodofficial', 'https://facebook.com/share/1G96524nRE/', '', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Menjadi Distributor produk ISRAFOOD untuk wilayah Anda', '', 'ISRAFOOD', 'Owner', '085889393101', true),

  -- DC HNI HPAI KARANGNUNGGAL
  ('dc-hni-hpai-karangnunggal', 'DC HNI HPAI KARANGNUNGGAL', 'Distributor center produk HNI, menjual produk HNI dan membuka kesempatan utk mitra2 baru yg mau serius bergabung utk mengembangkan bisnis HNI', '1 tahun', 'RT 002 RW 008 kampung sindanglengo desa Cikukulu kecamatan karangnunggal kabupaten Tasikmalaya', 'Tasikmalaya, Jawa Barat', '0', '/images/hni-hpai-logo.jpg', '', '', 'https://instagram.com/dewipuspitasari_85', '', 'https://tiktok.com/@dewi_puspitasari85', (SELECT id FROM categories WHERE slug = 'kesehatan-herbal'), 'Siap menyediakan produk utk di jual kembali dan produk contoh utk di jadikan tester. Menjadi Agen HNI HPAI.', '', 'Distributor center HNI', 'Eksekutif Direktur', '081323773342', true),

  -- Dapoer Reka
  ('dapoer-reka', 'Dapoer Reka', 'Usaha Dapoer Reka adalah usaha di bidang makanan yang menjual aneka cemilan dan juga menerima pesanan nasi box', '15 tahun', 'Pasar Singaparna', 'Jawa Barat', '0', '/images/dapoer-reka-logo.png', 'https://drive.google.com/folderview?id=1oa-78050mZ2Y-Rn-Vcs4V5geWyP9hE6c', '', 'https://instagram.com/dapoer.reka', 'https://facebook.com/Dapoer Reka', '', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Dapoer Reka menawarkan siapa pun bisa menjadi reseller atau penyuplai bahan baku produksi', '', 'Mamah Salamah', 'Owner', '085320955856', true),

  -- Tiara Jaya Farm
  ('tiara-jaya-farm', 'Tiara Jaya Farm', 'Peternakan Ayam Petelur', '5 Tahun', 'Dusun Manangga RT 10 RW 4, Desa Cijeruk, Kec. Pamulihan, Kab. Sumedang', 'Jawa Barat', '1', '/images/tiara-jaya-farm-logo.jpg', '', '', 'https://instagram.com/TiaraJayaFarm', 'https://facebook.com/Tiara Jaya Farm', 'https://tiktok.com/@TiaraJayaFarm', (SELECT id FROM categories WHERE slug = 'peternakan'), 'Menjadi Distributor Telur', '', 'Drs. H. Rohmat', 'CEO', '0811648254', true),

  -- Saefaza by Kaza Boba Soreang
  ('saefaza-by-kaza-boba-soreang', 'Saefaza by Kaza Boba Soreang', 'Produk Aneka Minuman kekinian kemasan berbahan dasar kopi, susu, coklat dan buah-buahan', '5 Tahun', 'Kaza bubble tea soreang, Jln Bojongkoneng kp Cibolang RT 02 RW 08 Cingcin Soreang Kab. Bandung', 'Jawa Barat', '1', '/images/saefaza-logo.png', '', '', 'https://instagram.com/sae.kaza.soreang', '', '', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Menyediakan Bahan baku dan Pelatihan untuk mitra ingin berjualan aneka minuman kekinian dengan BRAND SAEFAZA (Sudah HKI) dan HALAL. Atau menjadi Reseller produk kami untuk keperluan harian, rapat dll.', '', 'Yani Suryani', 'Owner', '081313350309', false),

  -- K4y Takoyaki
  ('k4y-takoyaki', 'K4y Takoyaki', 'Kudapan Jepang Halal', '7 Tahun', 'Manglayang Regency Blok D1 no 47 Cimekar Cileunyi Kabupaten Bandung', 'Jawa Barat', '1', 'https://drive.google.com/open?id=1QPcaOWBOVRYlvyWoJZ0at2_oI78WmkV1', 'https://drive.google.com/drive/folders/1GXmxAUxuUS60DJ3pTPD_fYFsLY2JDz4T', '', 'https://instagram.com/K4ytakoyaki_bandung', '', 'https://tiktok.com/@K4ytakoyaki_bandung', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Kita membuka peluang kemitraan dengan menggunakan brand K4y Takoyaki dan penjualan bahan Baku (Tepung premix dan Saos Jepang Halal olahan sendiri)', '', 'Yo Joko Priyono', 'Owner', '0811249931', false),

  -- Gudeg Plus
  ('gudeg-plus', 'Gudeg Plus', 'Gudeg Plus (Istimewa Khas Jogjakarta)', '13 Tahun', 'Jl. Moch. Hatta No. 196 Kota Tasikmalaya', 'Kota Tasikmalaya, Jawa Barat', '1', 'https://drive.google.com/open?id=1FwL1gCU3zlwTZqjvTSvDTN7O8hR9WijK', 'https://drive.google.com/file/d/1nT-WYUy5HHxiTNwfdocjsOtQ73ppDcwG/view?usp=drivesdk', '', '', '', '', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Siap Mengirimkan Gudeg Plus sebagai produk utama, memberikan pelatihan dan resep untuk menu pelengkap (Opor Ayam kampung, kerecek, bacem, tahu dll)', '', 'Isbianta', 'Owner', '085322475255', false),

  -- Hijab Bilqis
  ('hijab-bilqis', 'Hijab Bilqis', 'Produksi busana muslim dan muslimah, dari anak hingga dewasa. Melayani request, untuk perorangan dan grup.', '19 Tahun', 'Jl Sadananya no 178 Desa Sukajadi kec Sadananya', 'Ciamis, Jawa Barat', '0', 'https://drive.google.com/open?id=10rJbjz9QDLXo8saYTcBOIsmI6bjD1lH2', 'https://online.fliphtml5.com/rbcgj/egww/', 'https://online.fliphtml5.com/rbcgj/egww/', 'https://instagram.com/hijab.bilqis', 'https://facebook.com/Bilqis Syar''i', 'https://tiktok.com/@hijab.bilqis', (SELECT id FROM categories WHERE slug = 'fashion'), 'Dibutuhkan reseller aktif, untuk memasarkan produk Hijab Bilqis di seluruh Jawa Barat khususnya, dan Indonesia pada umumnya.', '', 'Tating Faridah', 'Owner', '087816981838', false),

  -- LeKulinair
  ('lekulinair', 'LeKulinair', 'Usaha yang bergerak di bidang makanan minuman. Produk unggulan roti, bagelan, sinom, kopi', '2 Tahun', 'Jl Belimbing V AF3 No 10 Kotabaru Bekasi Barat', 'Kota Bekasi, Jawa Barat', '1', 'https://drive.google.com/open?id=1pjBLaltyscATbz_b_oEhGyyHxqieu3ef', '', '', 'https://instagram.com/lekulinair', '', '', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Program Kemitraan dengan selisih 20-30%', '', 'Bachtiar Rachman', 'Pemilik', '081331046798', false),

  -- Radenshop Aksessoris
  ('radenshop-aksessoris', 'Radenshop Aksessoris', 'Aksessoris pin, medali, emblem bahan timah cor', '8 tahun', 'Jl Kopo 23 Bandung', 'Jawa Barat', '0', 'https://drive.google.com/open?id=1QJr508ZRFytlQI88_d6h7nT-hBb7iBa-', '', '', 'https://instagram.com/RADENSHOP_PINCORCUSTOM', 'https://facebook.com/Aden R R', 'https://tiktok.com/@radenshop Aksessoris', (SELECT id FROM categories WHERE slug = 'kerajinan'), 'Bisa di up harga untuk reseller dari harga bandrol/diskon', '', 'Aden Rony Rochman', 'Marketing Online Shop', '087821155089', false),

  -- Laris Manis Coklat
  ('laris-manis-coklat', 'Laris Manis Coklat', 'Jualan coklat rijekan delfi, jualan coklat kiloan, jualan jajanan UMKM seperti pempek, cireng isi, makanan ringan lainnya', '3 tahun', 'Sanggar Indah Banjaran Blok DH, No. 06 RT 02 RW 06', 'Kab Bandung, Jawa Barat', '1', 'https://drive.google.com/open?id=1c5q_s1lM9x2Mx4YS1YE0sjLCjvsihhI2', '', 'https://id.shp.ee/fp6Re29', 'https://instagram.com/Yurirahmani', '', 'https://tiktok.com/@Yuriarahmai', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Menjadi reseller coklat dan jajanan UMKM', '', 'Yuri Rahmani', 'Owner', '089676288460', false),

  -- Kentang Balado Teh Dian
  ('kentang-balado-teh-dian', 'Kentang Balado Teh Dian', 'Memproduksi kentang balado/mustofa, di buat dari kentang pilihan, dengan racikan yang mantap sehingga disukai semua kalangan. Bisa dijadikan cemilan teman nasi ataupun sebagai oleh-oleh.', 'Lebih dari 10 tahun', 'Semplak RT4 RW3', 'Jawa Barat', '10', 'https://drive.google.com/open?id=1UaTyC8b3gNEM4qg_V6KgT3nfsQLNcfif', 'https://drive.google.com/file/d/1-qFeIRnxscFzO4v_hPMPsIFQAXGjYobk/view?usp=drivesdk', '', 'https://instagram.com/Dian Mulyanti', 'https://facebook.com/Dian Mulyanti', 'https://tiktok.com/@Dian Mulyanti', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Konsinyasi', '', 'Dian Mulyanti', 'Owner', '081291981121', false),

  -- Premium Melon by GSF
  ('premium-melon-by-gsf', 'Premium Melon by GSF', 'Melon Premium Hidroponik by GSF', '3 tahun', 'Grand Sakina Residence, Jl Arif Rahman Hakim Subang', 'Subang, Jawa Barat', '4 (Reseller)', 'https://drive.google.com/open?id=1Tc4N867fDWAOCGfKNK0Uf8PpiFfUVlcM', '', '', 'https://instagram.com/Grandsakinafarm', 'https://facebook.com/Grand Sakina Farm Subang', 'https://tiktok.com/@grandsakinafarm', (SELECT id FROM categories WHERE slug = 'pertanian'), 'Reseller buah melon premium', '', 'Adimas MW', 'Owner', '085321440366', false),

  -- SAE FOOD
  ('sae-food', 'SAE FOOD', 'Produk keripik Ikan Lapan rasa Balado, Asin, Pedas', '1 tahun', 'Dusun Buwer RT 06/02 Desa Rancajaya Kec Patokbeusi Subang', 'Subang, Jawa Barat', '1', 'https://drive.google.com/open?id=1Azsxk1EDfR4r7t-ZkHR_w801GHjD5CZf', '', '', '', '', '', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Menjualkan produk, adapun keuntungan 10% dari harga jual, atau harga jual diserahkan ke reseller', '', 'Hasanah Arifin', 'Ketua', '081224243733', false),

  -- Rumah Produksi Mang Den
  ('rumah-produksi-mang-den', 'Rumah Produksi Mang Den', 'Produsen kulit dimsum, kulit pangsit dan mie. Melayani pemesanan kulit dimsum berbagai ukuran, kulit pangsit dan mie', '3 tahun', 'Kp Kukupu RT 02 RW 06 Cibadak Tanah Sareal Kota Bogor', 'Jawa Barat', '0', 'https://drive.google.com/open?id=1_1fWcOl1ZZ3RcNaI7aGEqZMjEWOYeaN8', '', 'www.produsenkulitdimsum.com', 'https://instagram.com/Kulitdimsumangden', '', 'https://tiktok.com/@Kulitdimsummangden', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Menyediakan bahan baku kulit dimsum, kulit pangsit dan mie untuk mitra usaha', '', 'Deni Kurniawan', 'Owner', '08174839958', false),

  -- Warung Berkah
  ('warung-berkah', 'Warung Berkah', 'Jualan lauk makanan seperti sambal kering, rendang, perpastaan dll', 'Hampir 10 tahun', 'Komp Assyifa Alkhoeriyyah Subang Rt 24 Rw 04 Desa Tambakmekar Jalancagak Subang', 'Jawa Barat', '0', 'https://drive.google.com/open?id=1D36zs5pMwqBKcxGl4yj3qkTaCkTzx3il', 'https://drive.google.com/drive/folders/1umCvzSQ3l9VylguMU6fLtpatjM27U2ju', '', '', '', '', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Penyediaan stok makanan untuk dropship', '', 'Rina Komala', 'CEO', '082121189489', false),

  -- Bisto Air Mineral
  ('bisto-air-mineral', 'Bisto Air Mineral', 'Distributor Air mineral dalam kemasan', '1 tahun', 'Jl.Kerkof kp.kihapit barat Rt 09 rw09 Gang Pendidikan II No.53A Kel.Leuwigajah Kec.Cimahi Selatan- kota Cimahi', 'Cimahi, Jawa Barat', '8', 'https://drive.google.com/open?id=1iuQHIzHygFaEZ3NxmHTBiCRjJJD8hPq6', '', '', 'https://instagram.com/bengkel_mmc', 'https://facebook.com/share/14TyZ8EDdHy/', 'https://tiktok.com/@bengkelmobil_mmc', (SELECT id FROM categories WHERE slug = 'jasa-otomotif'), 'Partner bisnis untuk perluasan dan buka cabang baru', '', 'Guntur Widyaprasetya', 'Pemilik, Owner', '08129466849', false),

  -- Endutch Shop
  ('endutch-shop', 'Endutch Shop', 'Usaha dalam bidang kuliner Frozen, Snack box, nasi kotak, minuman', '5 tahun', 'Manglayang Regency Blok H 13 no.11', 'Kabupaten Bandung, Jawa Barat', '0', 'https://drive.google.com/open?id=1J85mlSh2GYGum8SZqoUXx7bAlDo-4_-e', '', '', 'https://instagram.com/Endutch Shop', 'https://facebook.com/Iryana Endutch', 'https://tiktok.com/@Endutch Shop', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Menjadi reseller produk frozen food dan catering', '', 'Mei Iryana', 'Owner', '089656478144', false),

  -- Bawang Goreng Brebes
  ('bawang-goreng-brebes', 'Bawang Goreng Brebes', 'Usaha bawang goreng Brebes yang premium / original tanpa campuran, dikemas di plastik ukuran 10x15 dititipkan ke warung-warung sayuran dan kemasan ples ditaruh di toko-toko kue, frozen dan sembako.', '10 bulan', 'Perum Taman Griya Kencana Blok A11/18, RT 05 RW 08, Kel Kencana, Kec Tanah Sareal', 'Bogor, Jawa Barat', '0', 'https://drive.google.com/open?id=1gLMUc3m_7pBQqLYRe9-8tlgbYx5kV8HG', '', '', '', '', '', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Kemasan ples 100gr dari saya 18rb biasanya harga jual 20rb dan kemasan plastik 20gr dari saya 5rb biasanya dijual 6rb', '', 'Pujiyono', 'Pemilik', '089604408490', false),

  -- AsKafood
  ('askafood', 'AsKafood', 'Supplier Tahu, Tempe, Telur. Produsen Bumbu Rujak (nama produk Bumbu Rujak Seuhah). Reseller Madu dan Kurma', '4 tahun', 'Alamat NIB terdaftar Kiaracondong Bandung, Alamat harian produksi Tambakan Jalancagak', 'Subang, Jawa Barat', '0', 'https://drive.google.com/open?id=1NVb3k6XVD97ZRoE5J5dT8Oe_hqaGhq5G', '', '', 'https://instagram.com/@askafood_', '', '', (SELECT id FROM categories WHERE slug = 'makanan-minuman'), 'Menyediakan Tahu, tempe, telur dan makanan lainnya langsung dari produsen dengan harga grosir', '', 'Asri Kartika', 'CEO', '081221505050', false),

  -- Ternak Ikan Lele Konsumsi (paling akhir karena tidak lengkap)
  ('ternak-ikan-lele-konsumsi', 'Ternak Ikan Lele Konsumsi', 'Penjualan ikan lele konsumsi', '2 bulan', '', 'Jawa Barat', '0', '', '', '', '', '', '', (SELECT id FROM categories WHERE slug = 'perikanan'), '', '', '', '', '', false)

ON CONFLICT (slug) DO NOTHING;
