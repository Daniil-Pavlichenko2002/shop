import type { ProductListParams } from '@/entities/products'

export const productQueryKeys = {
  products: ['products'],
  all: (filter?: ProductListParams) => [...productQueryKeys.products, filter],
  byId: (id: number) => [...productQueryKeys.products, 'byId', id],
  categories: () => [...productQueryKeys.products, 'categories'],
}
