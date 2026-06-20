-- Slug URL per produk (global unique, dari nama)

ALTER TABLE business_products ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

DO $$
DECLARE
  r RECORD;
  base_slug TEXT;
  candidate TEXT;
  suffix INT;
BEGIN
  FOR r IN SELECT id, nama FROM business_products WHERE slug IS NULL ORDER BY id LOOP
    base_slug := trim(both '-' FROM regexp_replace(
      regexp_replace(
        regexp_replace(lower(trim(r.nama)), '[^a-z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    ));

    IF base_slug = '' OR base_slug IS NULL THEN
      base_slug := 'produk-' || r.id::text;
    END IF;

    candidate := base_slug;
    suffix := 2;

    WHILE EXISTS (SELECT 1 FROM business_products WHERE slug = candidate AND id <> r.id) LOOP
      candidate := base_slug || '-' || suffix::text;
      suffix := suffix + 1;
    END LOOP;

    UPDATE business_products SET slug = candidate WHERE id = r.id;
  END LOOP;
END $$;

ALTER TABLE business_products ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_business_products_slug ON business_products (slug);
