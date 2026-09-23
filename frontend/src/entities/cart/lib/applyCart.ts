import type { QueryClient } from '@tanstack/vue-query'
import {
  type Cart,
  type CartBroadcastChannel,
  cartQueryKeys,
  useCartStore,
} from '@/entities/cart'

export const applyCartLocally = (queryClient: QueryClient, cart: Cart) => {
  useCartStore().setCartStore(cart)
  queryClient.setQueryData(cartQueryKeys.detail(), cart)
}

export const applyCartAndBroadcast = (
  queryClient: QueryClient,
  channel: BroadcastChannel | null,
  cart: Cart,
  userId: number | null,
) => {
  applyCartLocally(queryClient, cart)

  const message: CartBroadcastChannel = {
    type: 'cart-updated',
    userId,
    cart,
  }
  channel?.postMessage(message)
}
