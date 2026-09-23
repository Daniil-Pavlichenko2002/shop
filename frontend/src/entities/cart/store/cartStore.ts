import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Cart } from '@/entities/cart/model'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)

  const totalCount = computed(() => cart.value?.totalCount ?? 0)

  const setCartStore = (cartData: Cart) => (cart.value = cartData)

  const clearCartStore = () => (cart.value = null)

  const quantityByProductId = (productId: number): number =>
    cart.value?.items.find((item) => item.productId === productId)?.quantity ??
    0

  return { cart, totalCount, setCartStore, clearCartStore, quantityByProductId }
})
