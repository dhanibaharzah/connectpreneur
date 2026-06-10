ALTER TABLE business_products
ADD COLUMN IF NOT EXISTS tipe_bisnis VARCHAR(10) NOT NULL DEFAULT 'produk'
CHECK (tipe_bisnis IN ('produk', 'jasa'));
