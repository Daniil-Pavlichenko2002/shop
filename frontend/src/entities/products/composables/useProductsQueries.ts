import { useQuery } from '@tanstack/vue-query'
import { productsApiInstance } from '../api'
import { Status } from '@/shared'
import type { Product } from '@/entities/products'

export const useProductsQueries = () => {
  return useQuery({
    queryKey: ['product'],
    queryFn: async (): Promise<Product[]> => {
      const response = await productsApiInstance.getProducts()
      if (response.status === Status.Error) {
        throw new Error('Не удалось получить список продуктов')
      }

      return response.result as Product[]
    },
  })
}
