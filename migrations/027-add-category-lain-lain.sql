-- Business category used by mitra registration, admin, and catalog.
-- Those screens read the categories table (GET /api/categories and
-- GET /api/admin/categories). Idempotent: skip when the name or slug
-- is already present so this can be re-run safely.

INSERT INTO categories (name, slug)
SELECT 'Lain-lain', 'lain-lain'
WHERE NOT EXISTS (
  SELECT 1
  FROM categories
  WHERE LOWER(BTRIM(name)) = 'lain-lain'
     OR slug = 'lain-lain'
);
