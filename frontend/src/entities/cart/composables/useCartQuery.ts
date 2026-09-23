import { useQuery } from '@tanstack/vue-query'
import { Status } from '@/shared'
import type { Cart } from '@/entities/cart/model'
import { cartApiInstance } from '@/entities/cart/api'
import { cartQueryKeys } from '@/entities/cart/lib'
import { useCartStore } from '@/entities/cart/store/cartStore'
import { watch } from 'vue'

export const useCartQuery = () => {
  const cartStore = useCartStore()
  const query = useQuery({
    queryKey: cartQueryKeys.detail(),
    queryFn: async (): Promise<Cart> => {
      const response = await cartApiInstance.getCart()
      if (response.status === Status.Error) {
        throw new Error('Не удалось получить корзину')
      }
      return response.result as Cart
    },
  })

  watch(query.data, (cart) => {
    if (cart) cartStore.setCartStore(cart)
  })

  return query
}
