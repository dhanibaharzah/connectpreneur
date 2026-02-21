-- Add legal document columns to businesses table
-- These store PDF file URLs uploaded during business registration

ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS akta_pendirian_url VARCHAR(500);

ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS legalitas_url VARCHAR(500);
