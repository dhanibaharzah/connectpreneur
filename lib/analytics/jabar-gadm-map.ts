/**
 * GADM 4.1 uses NAME_2 without spaces (e.g. KotaBandung).
 * These keys must match our locations seed / analytics `kab_kota` labels.
 */
export const GADM_NAME2_TO_KAB_KOTA: Record<string, string> = {
  Bandung: "Kab. Bandung",
  BandungBarat: "Kab. Bandung Barat",
  Banjar: "Kota Banjar",
  Bekasi: "Kab. Bekasi",
  Bogor: "Kab. Bogor",
  Ciamis: "Kab. Ciamis",
  Cianjur: "Kab. Cianjur",
  Cimahi: "Kota Cimahi",
  Cirebon: "Kab. Cirebon",
  Depok: "Kota Depok",
  Garut: "Kab. Garut",
  Indramayu: "Kab. Indramayu",
  Karawang: "Kab. Karawang",
  Kuningan: "Kab. Kuningan",
  Majalengka: "Kab. Majalengka",
  Purwakarta: "Kab. Purwakarta",
  Subang: "Kab. Subang",
  Sukabumi: "Kab. Sukabumi",
  Sumedang: "Kab. Sumedang",
  Tasikmalaya: "Kab. Tasikmalaya",
  KotaBandung: "Kota Bandung",
  KotaBekasi: "Kota Bekasi",
  KotaBogor: "Kota Bogor",
  KotaCirebon: "Kota Cirebon",
  KotaSukabumi: "Kota Sukabumi",
  KotaTasikmalaya: "Kota Tasikmalaya",
  /** GADM v4.1 uses this label; we treat it as Kab. Pangandaran for analytics alignment */
  WadukCirata: "Kab. Pangandaran",
}

/** All 27 kab/kota labels aligned with DB seed & map features */
export const JAWA_BARAT_KAB_KOTA_LIST = [
  ...new Set(Object.values(GADM_NAME2_TO_KAB_KOTA)),
].sort((a, b) => a.localeCompare(b, "id"))

export function kabKotaFromGadmFeature(geo: { properties?: Record<string, unknown> }): string | null {
  const name2 = geo.properties?.NAME_2
  if (typeof name2 !== "string") return null
  return GADM_NAME2_TO_KAB_KOTA[name2] ?? null
}
