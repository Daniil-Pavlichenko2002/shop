import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { productQueryKeys } from '@/entities/products/lib'
import { type Product, productsApiInstance } from '@/entities/products'
import { Status } from '@/shared'

export const useProductByIdQuery = (id: MaybeRefOrGetter<number | null>) => {
  return useQuery({
    queryKey: computed(() => [...productQueryKeys.byId(toValue(id) ?? 0)]),
    queryFn: async (): Promise<Product> => {
      const productId = toValue(id)
      if (!productId) {
        throw new Error('ID продукта не указан')
      }

      const response = await productsApiInstance.getProductById(productId)
      if (response.status === Status.Error) {
        throw new Error('Ошибка при загрузке продукта')
      }
      return response.result as Product
    },
    enabled: computed(() => !!toValue(id)),
  })
}
