-- Deskripsi singkat produk mitra

ALTER TABLE business_products
  ADD COLUMN IF NOT EXISTS deskripsi TEXT;
