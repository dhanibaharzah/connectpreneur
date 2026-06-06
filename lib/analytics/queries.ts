import { sql } from "@/lib/sql"

export async function getAnalyticsOverview() {
  const [row] = await sql`
    SELECT
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events WHERE event_type = 'page_view') AS mitra_unique_visitors,
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events WHERE event_type = 'catalog_page_view') AS catalog_unique_visitors,
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events WHERE event_type = 'catalog_cta_click') AS catalog_cta_unique,
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events WHERE event_type IN ('whatsapp_click', 'rfq_submit')) AS whatsapp_unique,
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events WHERE event_type = 'website_click') AS website_unique,
      (SELECT COUNT(DISTINCT session_id)::int FROM analytics_events WHERE event_type = 'social_click') AS social_unique,
      (SELECT COUNT(*)::int FROM analytics_events) AS total_events
  `
  return row
}

export async function getMitraUniqueVisitors() {
  return sql`
    SELECT
      b.id,
      b.nama,
      b.slug,
      COALESCE(kab.name, NULLIF(TRIM(b.kota_provinsi), ''), 'Tidak diketahui') AS kab_kota,
      COUNT(DISTINCT e.session_id)::int AS unique_visitors,
      COUNT(DISTINCT CASE WHEN e2.event_type IN ('whatsapp_click', 'rfq_submit') THEN e2.session_id END)::int AS whatsapp_unique,
      COUNT(DISTINCT CASE WHEN e2.event_type = 'website_click' THEN e2.session_id END)::int AS website_unique,
      COUNT(DISTINCT CASE WHEN e2.event_type = 'social_click' THEN e2.session_id END)::int AS social_unique
    FROM businesses b
    LEFT JOIN locations l ON b.location_id = l.id
    LEFT JOIN locations kab ON kab.id = CASE
      WHEN l.level = 'kabupaten_kota' THEN l.id
      WHEN l.level = 'kecamatan' THEN l.parent_id
      ELSE NULL
    END
    LEFT JOIN analytics_events e ON e.business_id = b.id AND e.event_type = 'page_view'
    LEFT JOIN analytics_events e2 ON e2.business_id = b.id
      AND e2.event_type IN ('whatsapp_click', 'rfq_submit', 'website_click', 'social_click')
    GROUP BY b.id, b.nama, b.slug, kab.name, b.kota_provinsi
    ORDER BY unique_visitors DESC, b.nama ASC
  `
}

export async function getViewsByKabKota() {
  return sql`
    SELECT
      kab_kota,
      COUNT(DISTINCT e.session_id)::int AS unique_visitors,
      COUNT(DISTINCT b.id)::int AS mitra_count
    FROM (
      SELECT
        b.id,
        COALESCE(kab.name, NULLIF(TRIM(b.kota_provinsi), ''), 'Tidak diketahui') AS kab_kota
      FROM businesses b
      LEFT JOIN locations l ON b.location_id = l.id
      LEFT JOIN locations kab ON kab.id = CASE
        WHEN l.level = 'kabupaten_kota' THEN l.id
        WHEN l.level = 'kecamatan' THEN l.parent_id
        ELSE NULL
      END
    ) b
    LEFT JOIN analytics_events e ON e.business_id = b.id AND e.event_type = 'page_view'
    GROUP BY kab_kota
    HAVING COUNT(DISTINCT e.session_id) > 0
    ORDER BY unique_visitors DESC
    LIMIT 25
  `
}

export async function getVisitorOriginByCity() {
  return sql`
    SELECT
      COALESCE(visitor_city, 'Tidak diketahui') AS city,
      COALESCE(visitor_region, '') AS region,
      COUNT(DISTINCT session_id)::int AS unique_visitors
    FROM analytics_events
    WHERE event_type = 'page_view'
    GROUP BY visitor_city, visitor_region
    ORDER BY unique_visitors DESC
    LIMIT 20
  `
}

export async function getSocialClicksByPlatform() {
  return sql`
    SELECT
      COALESCE(metadata->>'platform', 'unknown') AS platform,
      COUNT(DISTINCT session_id)::int AS unique_visitors
    FROM analytics_events
    WHERE event_type = 'social_click'
    GROUP BY metadata->>'platform'
    ORDER BY unique_visitors DESC
  `
}
