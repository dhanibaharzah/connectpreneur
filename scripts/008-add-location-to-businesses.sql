-- Tambah kolom location_id ke tabel businesses
-- Referensi ke tabel locations untuk menyimpan lokasi kecamatan bisnis

ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS location_id INTEGER REFERENCES locations(id);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(location_id);

-- Catatan: 
-- Kolom kota_provinsi (VARCHAR) tetap ada untuk backward compatibility
-- Data existing perlu di-backfill secara manual dengan UPDATE:
-- 
-- Contoh backfill:
-- UPDATE businesses b
-- SET location_id = (
--   SELECT l.id FROM locations l 
--   WHERE l.level = 'kecamatan' 
--   AND l.name ILIKE '%nama_kecamatan%'
--   LIMIT 1
-- )
-- WHERE b.kota_provinsi ILIKE '%nama_kota%';

COMMENT ON COLUMN businesses.location_id IS 'Referensi ke lokasi kecamatan bisnis (tabel locations)';
