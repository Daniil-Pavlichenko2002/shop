import { useQuery } from '@tanstack/vue-query'
import { productsApiInstance } from '../api'
import { Status } from '@/shared'
import type { ProductListParams, ProductResponse } from '@/entities/products'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { productQueryKeys } from '@/entities/products/lib'

export const useProductsQueries = (
  params?: MaybeRefOrGetter<ProductListParams>,
) => {
  return useQuery({
    queryKey: computed(() => [...productQueryKeys.all(toValue(params))]),
    queryFn: async (): Promise<ProductResponse> => {
      const response = await productsApiInstance.getProducts(toValue(params))
      if (response.status === Status.Error) {
        throw new Error('Не удалось получить список продуктов')
      }

      return response.result as ProductResponse
    },
  })
}
