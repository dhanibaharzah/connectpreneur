import type { AdminUser } from "@/lib/auth"
import { getAdminLocationScope } from "@/lib/auth"
import { sql } from "@/lib/sql"
import { getOrUpdateScore } from "@/lib/business/connect-score"
import { getConnectScoreTier, hasDocument } from "@/lib/business/connect-score-tier"
import { deleteObject, isDeletableStorageUrl } from "@/lib/integrations/storage"

export type AdminBusinessListParams = {
  page: number
  limit: number
  search: string
  status: string
  tier: string
}

export async function checkBusinessAccess(
  user: AdminUser,
  businessLocationId: number | null,
): Promise<boolean> {
  const locationScope = await getAdminLocationScope(user)
  if (locationScope === null) return true
  if (!businessLocationId) return false
  return locationScope.includes(businessLocationId)
}

export async function listAdminBusinesses(user: AdminUser, params: AdminBusinessListParams) {
  const { page, limit, search, status, tier: tierFilter } = params
  const useTierFilter = tierFilter !== "all"
  const offset = (page - 1) * limit
  const queryLimit = useTierFilter ? 10000 : limit
  const queryOffset = useTierFilter ? 0 : offset

  const locationScope = await getAdminLocationScope(user)
  const hasLocationFilter = locationScope !== null

  let pendingCount: number
  if (hasLocationFilter) {
    const pendingCountResult = await sql`
      SELECT COUNT(*) as count FROM businesses 
      WHERE is_active = false AND location_id = ANY(${locationScope})
    `
    pendingCount = Number.parseInt(pendingCountResult[0].count)
  } else {
    const pendingCountResult = await sql`SELECT COUNT(*) as count FROM businesses WHERE is_active = false`
    pendingCount = Number.parseInt(pendingCountResult[0].count)
  }

  let businesses
  let total

  if (hasLocationFilter) {
    if (search) {
      if (status === "pending") {
        businesses = await sql`
          SELECT b.*, c.name as category_name
          FROM businesses b
          LEFT JOIN categories c ON b.category_id = c.id
          WHERE b.nama ILIKE ${"%" + search + "%"} AND b.is_active = false
            AND b.location_id = ANY(${locationScope})
          ORDER BY b.is_featured DESC, b.created_at DESC
          LIMIT ${queryLimit} OFFSET ${queryOffset}
        `
        const countResult = await sql`
          SELECT COUNT(*) as count FROM businesses
          WHERE nama ILIKE ${"%" + search + "%"} AND is_active = false
            AND location_id = ANY(${locationScope})
        `
        total = Number.parseInt(countResult[0].count)
      } else if (status === "active") {
        businesses = await sql`
          SELECT b.*, c.name as category_name
          FROM businesses b
          LEFT JOIN categories c ON b.category_id = c.id
          WHERE b.nama ILIKE ${"%" + search + "%"} AND b.is_active = true
            AND b.location_id = ANY(${locationScope})
          ORDER BY b.is_featured DESC, b.created_at DESC
          LIMIT ${queryLimit} OFFSET ${queryOffset}
        `
        const countResult = await sql`
          SELECT COUNT(*) as count FROM businesses
          WHERE nama ILIKE ${"%" + search + "%"} AND is_active = true
            AND location_id = ANY(${locationScope})
        `
        total = Number.parseInt(countResult[0].count)
      } else {
        businesses = await sql`
          SELECT b.*, c.name as category_name
          FROM businesses b
          LEFT JOIN categories c ON b.category_id = c.id
          WHERE b.nama ILIKE ${"%" + search + "%"}
            AND b.location_id = ANY(${locationScope})
          ORDER BY b.is_featured DESC, b.created_at DESC
          LIMIT ${queryLimit} OFFSET ${queryOffset}
        `
        const countResult = await sql`
          SELECT COUNT(*) as count FROM businesses
          WHERE nama ILIKE ${"%" + search + "%"}
            AND location_id = ANY(${locationScope})
        `
        total = Number.parseInt(countResult[0].count)
      }
    } else if (status === "pending") {
      businesses = await sql`
        SELECT b.*, c.name as category_name
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.is_active = false AND b.location_id = ANY(${locationScope})
        ORDER BY b.is_featured DESC, b.created_at DESC
        LIMIT ${queryLimit} OFFSET ${queryOffset}
      `
      const countResult = await sql`
        SELECT COUNT(*) as count FROM businesses 
        WHERE is_active = false AND location_id = ANY(${locationScope})
      `
      total = Number.parseInt(countResult[0].count)
    } else if (status === "active") {
      businesses = await sql`
        SELECT b.*, c.name as category_name
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.is_active = true AND b.location_id = ANY(${locationScope})
        ORDER BY b.is_featured DESC, b.created_at DESC
        LIMIT ${queryLimit} OFFSET ${queryOffset}
      `
      const countResult = await sql`
        SELECT COUNT(*) as count FROM businesses 
        WHERE is_active = true AND location_id = ANY(${locationScope})
      `
      total = Number.parseInt(countResult[0].count)
    } else {
      businesses = await sql`
        SELECT b.*, c.name as category_name
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.location_id = ANY(${locationScope})
        ORDER BY b.is_featured DESC, b.created_at DESC
        LIMIT ${queryLimit} OFFSET ${queryOffset}
      `
      const countResult = await sql`
        SELECT COUNT(*) as count FROM businesses 
        WHERE location_id = ANY(${locationScope})
      `
      total = Number.parseInt(countResult[0].count)
    }
  } else if (search) {
    if (status === "pending") {
      businesses = await sql`
        SELECT b.*, c.name as category_name
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.nama ILIKE ${"%" + search + "%"} AND b.is_active = false
        ORDER BY b.is_featured DESC, b.created_at DESC
        LIMIT ${queryLimit} OFFSET ${queryOffset}
      `
      const countResult = await sql`
        SELECT COUNT(*) as count FROM businesses
        WHERE nama ILIKE ${"%" + search + "%"} AND is_active = false
      `
      total = Number.parseInt(countResult[0].count)
    } else if (status === "active") {
      businesses = await sql`
        SELECT b.*, c.name as category_name
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.nama ILIKE ${"%" + search + "%"} AND b.is_active = true
        ORDER BY b.is_featured DESC, b.created_at DESC
        LIMIT ${queryLimit} OFFSET ${queryOffset}
      `
      const countResult = await sql`
        SELECT COUNT(*) as count FROM businesses
        WHERE nama ILIKE ${"%" + search + "%"} AND is_active = true
      `
      total = Number.parseInt(countResult[0].count)
    } else {
      businesses = await sql`
        SELECT b.*, c.name as category_name
        FROM businesses b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.nama ILIKE ${"%" + search + "%"}
        ORDER BY b.is_featured DESC, b.created_at DESC
        LIMIT ${queryLimit} OFFSET ${queryOffset}
      `
      const countResult = await sql`
        SELECT COUNT(*) as count FROM businesses
        WHERE nama ILIKE ${"%" + search + "%"}
      `
      total = Number.parseInt(countResult[0].count)
    }
  } else if (status === "pending") {
    businesses = await sql`
      SELECT b.*, c.name as category_name
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.is_active = false
      ORDER BY b.is_featured DESC, b.created_at DESC
      LIMIT ${queryLimit} OFFSET ${queryOffset}
    `
    const countResult = await sql`SELECT COUNT(*) as count FROM businesses WHERE is_active = false`
    total = Number.parseInt(countResult[0].count)
  } else if (status === "active") {
    businesses = await sql`
      SELECT b.*, c.name as category_name
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.is_active = true
      ORDER BY b.is_featured DESC, b.created_at DESC
      LIMIT ${queryLimit} OFFSET ${queryOffset}
    `
    const countResult = await sql`SELECT COUNT(*) as count FROM businesses WHERE is_active = true`
    total = Number.parseInt(countResult[0].count)
  } else {
    businesses = await sql`
      SELECT b.*, c.name as category_name
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      ORDER BY b.is_featured DESC, b.created_at DESC
      LIMIT ${queryLimit} OFFSET ${queryOffset}
    `
    const countResult = await sql`SELECT COUNT(*) as count FROM businesses`
    total = Number.parseInt(countResult[0].count)
  }

  const businessIds = businesses.map((b) => b.id)
  let scoresMap = new Map<number, number | null>()
  if (businessIds.length > 0) {
    const scores = await sql`
      SELECT business_id, score FROM connect_scores
      WHERE business_id = ANY(${businessIds})
    `
    scoresMap = new Map(scores.map((s) => [s.business_id, s.score] as [number, number]))
  }

  const businessesWithImages = await Promise.all(
    businesses.map(async (b) => {
      const productImages = await sql`
        SELECT * FROM product_images 
        WHERE business_id = ${b.id}
        ORDER BY sort_order
      `
      const connect_score = scoresMap.get(b.id) ?? null
      return {
        ...b,
        product_images: productImages,
        connect_score,
        connect_score_tier: getConnectScoreTier(connect_score, {
          hasAkta: hasDocument(b.akta_pendirian_url),
          hasLegalitas: hasDocument(b.legalitas_url),
          isVerified: b.is_active === true,
        }),
      }
    }),
  )

  let filteredBusinesses = businessesWithImages
  if (useTierFilter) {
    filteredBusinesses = businessesWithImages.filter((b) => b.connect_score_tier === tierFilter)
    total = filteredBusinesses.length
    filteredBusinesses = filteredBusinesses.slice(offset, offset + limit)
  }

  return {
    businesses: filteredBusinesses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    pendingCount,
  }
}

export async function createAdminBusiness(body: Record<string, unknown>) {
  const {
    nama,
    slug,
    deskripsi,
    lama_usaha,
    alamat,
    kota_provinsi,
    location_id,
    category_id,
    jenis_peluang,
    deskripsi_kemitraan,
    link_kemitraan,
    link_galeri,
    website,
    instagram,
    facebook,
    tiktok,
    nama_pic,
    jabatan_pic,
    kontak_pic,
    logo_url,
    jumlah_cabang,
    is_featured,
    product_images,
    akta_pendirian_url,
    legalitas_url,
  } = body

  if (!nama || !slug) {
    return { error: "Nama dan slug harus diisi", status: 400 as const }
  }

  if (!category_id) {
    return { error: "Kategori harus dipilih", status: 400 as const }
  }

  const existingSlug = await sql`SELECT id FROM businesses WHERE slug = ${slug as string}`
  if (existingSlug.length > 0) {
    return { error: "Slug sudah digunakan", status: 400 as const }
  }

  const result = await sql`
    INSERT INTO businesses (
      nama, slug, deskripsi, lama_usaha, alamat, kota_provinsi, location_id,
      category_id, jenis_peluang, deskripsi_kemitraan, link_kemitraan, link_galeri, website,
      instagram, facebook, tiktok, nama_pic, jabatan_pic, kontak_pic,
      logo_url, jumlah_cabang, akta_pendirian_url, legalitas_url,
      is_featured, is_active
    ) VALUES (
      ${nama as string}, 
      ${slug as string}, 
      ${(deskripsi as string) ?? null}, 
      ${(lama_usaha as string) ?? null},
      ${(alamat as string) ?? null}, 
      ${(kota_provinsi as string) ?? null}, 
      ${location_id ? Number(location_id) : null},
      ${category_id ? Number(category_id) : null},
      ${(jenis_peluang as string) ?? null},
      ${(deskripsi_kemitraan as string) ?? null}, 
      ${(link_kemitraan as string) ?? null},
      ${(link_galeri as string) ?? null},
      ${(website as string) ?? null},
      ${(instagram as string) ?? null}, 
      ${(facebook as string) ?? null}, 
      ${(tiktok as string) ?? null},
      ${(nama_pic as string) ?? null}, 
      ${(jabatan_pic as string) ?? null}, 
      ${(kontak_pic as string) ?? null},
      ${(logo_url as string) ?? null}, 
      ${(jumlah_cabang as string) ?? "0"}, 
      ${(akta_pendirian_url as string) ?? null},
      ${(legalitas_url as string) ?? null},
      ${(is_featured as boolean) ?? false}, 
      true
    )
    RETURNING *
  `

  const business = result[0]

  const images = product_images as Array<{ url?: string; image_url?: string }> | undefined
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      const imageUrl = img.url || img.image_url
      if (imageUrl) {
        await sql`
          INSERT INTO product_images (business_id, image_url, sort_order)
          VALUES (${business.id}, ${imageUrl}, ${i + 1})
        `
      }
    }
  }

  return { business, status: 201 as const }
}

export async function getAdminBusinessById(user: AdminUser, id: string) {
  const businesses = await sql`
    SELECT b.*, c.name as category_name
    FROM businesses b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.id = ${id}
  `

  if (businesses.length === 0) {
    return { error: "Bisnis tidak ditemukan", status: 404 as const }
  }

  const hasAccess = await checkBusinessAccess(user, businesses[0].location_id)
  if (!hasAccess) {
    return { error: "Forbidden", status: 403 as const }
  }

  const productImages = await sql`
    SELECT * FROM product_images 
    WHERE business_id = ${id}
    ORDER BY sort_order
  `

  const scoreResult = await getOrUpdateScore(
    businesses[0].id,
    businesses[0] as NonNullable<Parameters<typeof getOrUpdateScore>[1]>,
  )

  return {
    business: {
      ...businesses[0],
      product_images: productImages,
      connect_score: scoreResult?.score ?? null,
      connect_score_breakdown: scoreResult?.breakdown ?? null,
      connect_score_tier: getConnectScoreTier(scoreResult?.score ?? null, {
        hasAkta: hasDocument(businesses[0].akta_pendirian_url),
        hasLegalitas: hasDocument(businesses[0].legalitas_url),
        isVerified: businesses[0].is_active === true,
      }),
    },
  }
}

export async function updateAdminBusiness(user: AdminUser, id: string, body: Record<string, unknown>) {
  const existing = await sql`SELECT * FROM businesses WHERE id = ${id}`
  if (existing.length === 0) {
    return { error: "Bisnis tidak ditemukan", status: 404 as const }
  }

  const hasAccess = await checkBusinessAccess(user, existing[0].location_id)
  if (!hasAccess) {
    return { error: "Forbidden", status: 403 as const }
  }

  const {
    nama,
    slug,
    deskripsi,
    lama_usaha,
    alamat,
    kota_provinsi,
    location_id,
    category_id,
    jenis_peluang,
    deskripsi_kemitraan,
    link_kemitraan,
    link_galeri,
    website,
    instagram,
    facebook,
    tiktok,
    nama_pic,
    jabatan_pic,
    kontak_pic,
    logo_url,
    jumlah_cabang,
    is_featured,
    is_active,
    product_images,
    akta_pendirian_url,
    legalitas_url,
  } = body

  if (slug && slug !== existing[0].slug) {
    const existingSlug = await sql`SELECT id FROM businesses WHERE slug = ${slug as string} AND id != ${id}`
    if (existingSlug.length > 0) {
      return { error: "Slug sudah digunakan", status: 400 as const }
    }
  }

  const currentBusiness = existing[0]

  const result = await sql`
    UPDATE businesses SET
      nama = ${nama !== undefined ? nama : currentBusiness.nama},
      slug = ${slug !== undefined ? slug : currentBusiness.slug},
      deskripsi = ${deskripsi !== undefined ? deskripsi : currentBusiness.deskripsi},
      lama_usaha = ${lama_usaha !== undefined ? lama_usaha : currentBusiness.lama_usaha},
      alamat = ${alamat !== undefined ? alamat : currentBusiness.alamat},
      kota_provinsi = ${kota_provinsi !== undefined ? kota_provinsi : currentBusiness.kota_provinsi},
      location_id = ${location_id !== undefined ? (location_id ? Number(location_id) : null) : currentBusiness.location_id},
      category_id = ${category_id !== undefined ? (category_id ? Number(category_id) : null) : currentBusiness.category_id},
      jenis_peluang = ${jenis_peluang !== undefined ? jenis_peluang : currentBusiness.jenis_peluang},
      deskripsi_kemitraan = ${deskripsi_kemitraan !== undefined ? deskripsi_kemitraan : currentBusiness.deskripsi_kemitraan},
      link_kemitraan = ${link_kemitraan !== undefined ? link_kemitraan : currentBusiness.link_kemitraan},
      link_galeri = ${link_galeri !== undefined ? link_galeri : currentBusiness.link_galeri},
      website = ${website !== undefined ? website : currentBusiness.website},
      instagram = ${instagram !== undefined ? instagram : currentBusiness.instagram},
      facebook = ${facebook !== undefined ? facebook : currentBusiness.facebook},
      tiktok = ${tiktok !== undefined ? tiktok : currentBusiness.tiktok},
      nama_pic = ${nama_pic !== undefined ? nama_pic : currentBusiness.nama_pic},
      jabatan_pic = ${jabatan_pic !== undefined ? jabatan_pic : currentBusiness.jabatan_pic},
      kontak_pic = ${kontak_pic !== undefined ? kontak_pic : currentBusiness.kontak_pic},
      logo_url = ${logo_url !== undefined ? logo_url : currentBusiness.logo_url},
      jumlah_cabang = ${jumlah_cabang !== undefined ? jumlah_cabang : currentBusiness.jumlah_cabang},
      akta_pendirian_url = ${akta_pendirian_url !== undefined ? akta_pendirian_url : currentBusiness.akta_pendirian_url},
      legalitas_url = ${legalitas_url !== undefined ? legalitas_url : currentBusiness.legalitas_url},
      is_featured = ${is_featured !== undefined ? is_featured : currentBusiness.is_featured},
      is_active = ${is_active !== undefined ? is_active : currentBusiness.is_active},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `

  if (product_images !== undefined) {
    await sql`DELETE FROM product_images WHERE business_id = ${id}`

    const images = product_images as Array<{ url?: string; image_url?: string }> | null
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        const imageUrl = img.url || img.image_url
        if (imageUrl) {
          await sql`
            INSERT INTO product_images (business_id, image_url, sort_order)
            VALUES (${id}, ${imageUrl}, ${i + 1})
          `
        }
      }
    }
  }

  return { business: result[0] }
}

export async function deleteAdminBusiness(user: AdminUser, id: string) {
  const businesses = await sql`SELECT * FROM businesses WHERE id = ${id}`
  if (businesses.length === 0) {
    return { error: "Bisnis tidak ditemukan", status: 404 as const }
  }

  const hasAccess = await checkBusinessAccess(user, businesses[0].location_id)
  if (!hasAccess) {
    return { error: "Forbidden", status: 403 as const }
  }

  const business = businesses[0]
  const productImages = await sql`SELECT * FROM product_images WHERE business_id = ${id}`

  const imagesToDelete: string[] = []
  if (business.logo_url && isDeletableStorageUrl(business.logo_url)) {
    imagesToDelete.push(business.logo_url)
  }
  for (const img of productImages) {
    if (img.image_url && isDeletableStorageUrl(img.image_url)) {
      imagesToDelete.push(img.image_url)
    }
  }

  for (const url of imagesToDelete) {
    try {
      await deleteObject(url)
    } catch (e) {
      console.error("Failed to delete stored file:", url, e)
    }
  }

  await sql`DELETE FROM product_images WHERE business_id = ${id}`
  await sql`DELETE FROM businesses WHERE id = ${id}`

  return { success: true as const }
}
