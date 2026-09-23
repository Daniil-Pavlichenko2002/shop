import type { ProductForm } from '@/entities/products'

export const createDefaultProductListParams = (): ProductForm => ({
  categoryId: undefined,
  price_gte: undefined,
  price_lte: undefined,
  isPublished: undefined,
})
