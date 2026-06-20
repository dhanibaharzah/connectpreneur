-- Banner carousel for belanja.connectpreneur.id marketplace

CREATE TABLE IF NOT EXISTS shop_banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  link_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_banners_active_sort ON shop_banners (is_active, sort_order);
