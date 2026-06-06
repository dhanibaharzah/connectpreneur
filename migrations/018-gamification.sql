-- Gamification: buyer profiles, point ledger, business stats, pembeli OTP

CREATE TABLE IF NOT EXISTS buyer_profiles (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  display_name VARCHAR(255),
  total_points INT NOT NULL DEFAULT 0,
  badge_level VARCHAR(20) NOT NULL DEFAULT 'new',
  completed_orders INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS point_ledger (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('buyer', 'business')),
  entity_id VARCHAR(50) NOT NULL,
  transaction_id INT NOT NULL REFERENCES transactions(id),
  points INT NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (transaction_id, entity_type, event_type)
);

CREATE INDEX IF NOT EXISTS idx_point_ledger_entity ON point_ledger (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_point_ledger_transaction ON point_ledger (transaction_id);

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS gamification_points INT NOT NULL DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS gamification_completed_orders INT NOT NULL DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS gamification_failed_after_invoice INT NOT NULL DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS trust_tier VARCHAR(30);

CREATE TABLE IF NOT EXISTS pembeli_otp_challenges (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pembeli_otp_phone ON pembeli_otp_challenges (phone);
