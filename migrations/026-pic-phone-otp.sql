-- OTP challenges for verifying PIC WhatsApp numbers (registration + profile edit)
CREATE TABLE IF NOT EXISTS pic_phone_otp_challenges (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pic_phone_otp_phone ON pic_phone_otp_challenges (phone);
CREATE INDEX IF NOT EXISTS idx_pic_phone_otp_expires ON pic_phone_otp_challenges (expires_at);
