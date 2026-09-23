import type { Cart } from '@/entities/cart'
import { CART_CHANNEL_NAME } from '@/shared'

export interface CartBroadcastChannel {
  type: 'cart-updated'
  userId: number | null
  cart: Cart
}

export const createCartChannel = () => {
  if (typeof BroadcastChannel === 'undefined') return null

  return new BroadcastChannel(CART_CHANNEL_NAME)
}

let channel: BroadcastChannel | null | undefined
export const getCartChannel = () => {
  if (channel === undefined) {
    channel = createCartChannel()
  }
  return channel
}
