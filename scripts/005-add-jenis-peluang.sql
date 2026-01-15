-- Add jenis_peluang column to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS jenis_peluang VARCHAR(255);
