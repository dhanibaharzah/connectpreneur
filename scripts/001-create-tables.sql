-- Script untuk membuat tabel-tabel database ConnectPreneur

-- Tabel Categories (Jenis Usaha)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Businesses (Data Bisnis)
CREATE TABLE IF NOT EXISTS businesses (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  lama_usaha VARCHAR(100),
  alamat TEXT,
  kota_provinsi VARCHAR(255),
  jumlah_cabang VARCHAR(50) DEFAULT '0',
  logo_url TEXT,
  link_galeri TEXT,
  website TEXT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  category_id INTEGER REFERENCES categories(id),
  deskripsi_kemitraan TEXT,
  link_kemitraan TEXT,
  nama_pic VARCHAR(255),
  jabatan_pic VARCHAR(255),
  kontak_pic VARCHAR(50),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Product Images (Gambar Produk)
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_active ON businesses(is_active);
CREATE INDEX IF NOT EXISTS idx_product_images_business ON product_images(business_id);
