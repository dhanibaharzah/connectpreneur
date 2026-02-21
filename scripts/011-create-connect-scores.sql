-- ConnectScore table: stores computed completeness scores for businesses
-- Score is lazily calculated and cached, refreshed when business data changes

CREATE TABLE IF NOT EXISTS connect_scores (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  breakdown JSONB NOT NULL DEFAULT '{}',
  calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_connect_scores_business ON connect_scores(business_id);
CREATE INDEX IF NOT EXISTS idx_connect_scores_score ON connect_scores(score);
