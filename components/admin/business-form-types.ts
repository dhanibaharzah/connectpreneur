export interface AdminBusinessFormState {
  nama: string
  slug: string
  deskripsi: string
  lama_usaha: string
  alamat: string
  kota_provinsi: string
  location_id: number | null
  category_id: string
  jenis_peluang: string
  deskripsi_kemitraan: string
  website: string
  instagram: string
  facebook: string
  tiktok: string
  nama_pic: string
  jabatan_pic: string
  kontak_pic: string
  logo_url: string
  jumlah_cabang: string
  akta_pendirian_url: string
  legalitas_url: string
  is_featured: boolean
  is_active: boolean
}

export interface AdminProductImage {
  id?: number
  url: string
  image_url?: string
}

export const INITIAL_ADMIN_BUSINESS_FORM: AdminBusinessFormState = {
  nama: "",
  slug: "",
  deskripsi: "",
  lama_usaha: "",
  alamat: "",
  kota_provinsi: "",
  location_id: null,
  category_id: "",
  jenis_peluang: "",
  deskripsi_kemitraan: "",
  website: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  nama_pic: "",
  jabatan_pic: "",
  kontak_pic: "",
  logo_url: "",
  jumlah_cabang: "0",
  akta_pendirian_url: "",
  legalitas_url: "",
  is_featured: false,
  is_active: true,
}
