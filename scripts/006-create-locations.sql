-- Script untuk membuat tabel locations (Lokasi Wilayah Hierarki)
-- Struktur: Provinsi > Kabupaten/Kota > Kecamatan

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('provinsi', 'kabupaten_kota', 'kecamatan')),
  parent_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_locations_level ON locations(level);
CREATE INDEX IF NOT EXISTS idx_locations_parent ON locations(parent_id);
CREATE INDEX IF NOT EXISTS idx_locations_code ON locations(code);

-- Constraint: provinsi tidak boleh punya parent
-- Constraint: kabupaten_kota harus punya parent provinsi
-- Constraint: kecamatan harus punya parent kabupaten_kota
-- (Validasi ini akan dilakukan di level aplikasi untuk fleksibilitas)

COMMENT ON TABLE locations IS 'Tabel hierarki lokasi wilayah Indonesia (Provinsi > Kab/Kota > Kecamatan)';
COMMENT ON COLUMN locations.code IS 'Kode wilayah sesuai Kemendagri (contoh: 32 untuk Jawa Barat, 32-73 untuk Kota Bandung)';
COMMENT ON COLUMN locations.level IS 'Level hierarki: provinsi, kabupaten_kota, atau kecamatan';
COMMENT ON COLUMN locations.parent_id IS 'Referensi ke lokasi parent (NULL untuk provinsi)';
