import { useQuery } from '@tanstack/vue-query'
import { productQueryKeys } from '@/entities/products/lib'
import { type Category, productsApiInstance } from '@/entities/products'
import { Status } from '@/shared'

export const useCategoriesQueries = () => {
  return useQuery({
    queryKey: [productQueryKeys.categories],
    queryFn: async (): Promise<Category[]> => {
      const response = await productsApiInstance.getCategories()
      if (response.status === Status.Error) {
        throw new Error('Не удалось получить список категорий')
      }
      return response.result as Category[]
    },
  })
}
