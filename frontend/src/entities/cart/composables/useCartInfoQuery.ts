import { useQuery } from '@tanstack/vue-query'
import { Status } from '@/shared'
import type { CartInfo } from '@/entities/cart/model'
import { cartApiInstance } from '@/entities/cart/api'
import { cartQueryKeys } from '@/entities/cart/lib'

export const useCartInfoQuery = () => {
  return useQuery({
    queryKey: cartQueryKeys.info(),
    queryFn: async (): Promise<CartInfo> => {
      const response = await cartApiInstance.getCartInfo()
      if (response.status === Status.Error) {
        throw new Error('Не удалось получить информацию о корзине')
      }
      return response.result as CartInfo
    },
  })
}
