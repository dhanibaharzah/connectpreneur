export interface ShopBanner {
  id: number
  title: string | null
  imageUrl: string
  linkUrl: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
