-- Satu foto per produk mitra

ALTER TABLE business_products
  ADD COLUMN IF NOT EXISTS image_url TEXT;
