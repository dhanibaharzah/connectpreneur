-- Produk tersedia per mitra (nama + harga mulai)

CREATE TABLE IF NOT EXISTS business_products (
  id SERIAL PRIMARY KEY,
  business_id INT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  nama VARCHAR(255) NOT NULL,
  harga_mulai BIGINT NOT NULL CHECK (harga_mulai >= 0),
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_products_business_id ON business_products (business_id);
CREATE INDEX IF NOT EXISTS idx_business_products_active ON business_products (business_id, is_active);
