-- Add KTP document URL for mitra registration (image stored; OCR text not persisted)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS ktp_url TEXT;
