-- Analytics events for admin dashboard (unique visitors via distinct session_id)
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  business_id INTEGER REFERENCES businesses(id) ON DELETE SET NULL,
  session_id VARCHAR(64) NOT NULL,
  visitor_city VARCHAR(120),
  visitor_region VARCHAR(120),
  visitor_country VARCHAR(10) DEFAULT 'ID',
  referrer TEXT,
  page_path VARCHAR(500),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_business_type ON analytics_events(business_id, event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_session ON analytics_events(event_type, session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_city ON analytics_events(visitor_city) WHERE visitor_city IS NOT NULL;
