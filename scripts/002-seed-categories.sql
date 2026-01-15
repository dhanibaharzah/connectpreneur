-- Seed data untuk categories
INSERT INTO categories (name, slug) VALUES
  ('Makanan & Minuman', 'makanan-minuman'),
  ('Perikanan', 'perikanan'),
  ('Peternakan', 'peternakan'),
  ('Kesehatan & Herbal', 'kesehatan-herbal'),
  ('Fashion', 'fashion'),
  ('Kerajinan', 'kerajinan'),
  ('Pertanian', 'pertanian'),
  ('Jasa & Konstruksi', 'jasa-konstruksi'),
  ('Jasa & Otomotif', 'jasa-otomotif'),
  ('Kecantikan', 'kecantikan')
ON CONFLICT (slug) DO NOTHING;
