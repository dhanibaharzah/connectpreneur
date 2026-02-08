-- Add location_id to admin_users for location-based access control
-- 
-- superadmin with location_id = NULL → can see all businesses
-- admin with location_id → kabupaten_kota level → sees businesses in that kab/kota + all kecamatans under it
-- admin with location_id → kecamatan level → sees only businesses in that exact kecamatan

ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS location_id INTEGER REFERENCES locations(id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_location ON admin_users(location_id);

-- Note: existing admin users will have location_id = NULL (superadmin behavior)
-- Use manage-admin.ts or add-admin.ts to assign locations to admins
