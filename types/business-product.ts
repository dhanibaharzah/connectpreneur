export type ProductTipeBisnis = "produk" | "jasa"

export interface BusinessProduct {
  id: string
  nama: string
  deskripsi: string
  imageUrl: string
  hargaMulai: number
  tipeBisnis: ProductTipeBisnis
}

export const PRODUCT_TIPE_LABELS: Record<ProductTipeBisnis, string> = {
  produk: "Produk",
  jasa: "Jasa",
}
