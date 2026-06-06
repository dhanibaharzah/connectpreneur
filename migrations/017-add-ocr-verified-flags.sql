ALTER TABLE businesses ADD COLUMN IF NOT EXISTS ktp_ocr_verified BOOLEAN DEFAULT false;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS akta_ocr_verified BOOLEAN DEFAULT false;
