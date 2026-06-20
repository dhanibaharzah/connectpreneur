export interface DaftarMitraFormState {
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
  ktp_url: string
  logo_url: string
  jumlah_cabang: string
  akta_pendirian_url: string
  legalitas_url: string
}

export interface ProductImage {
  url: string
}

export const INITIAL_DAFTAR_MITRA_FORM: DaftarMitraFormState = {
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
  ktp_url: "",
  logo_url: "",
  jumlah_cabang: "0",
  akta_pendirian_url: "",
  legalitas_url: "",
}
