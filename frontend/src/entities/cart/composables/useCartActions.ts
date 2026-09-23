import { computed } from 'vue'
import {
  useAddCartItem,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from '@/entities/cart/composables/useCartMutations'
import { useCartStore } from '@/entities/cart/store/cartStore'

export const useCartActions = () => {
  const addItem = useAddCartItem()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const clearCart = useClearCart()
  const cartStore = useCartStore()

  const increment = (productId: number, by = 1) =>
    addItem.mutateAsync({ productId, quantity: by })

  const setQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      return removeItem.mutateAsync(productId)
    }
    return updateItem.mutateAsync({ productId, quantity })
  }

  const decrement = (productId: number) => {
    const current = cartStore.quantityByProductId(productId)
    if (current <= 1) {
      return removeItem.mutateAsync(productId)
    }
    return updateItem.mutateAsync({ productId, quantity: current - 1 })
  }

  const remove = (productId: number) => removeItem.mutateAsync(productId)

  const clear = () => clearCart.mutateAsync()

  const quantityOf = (productId: number) =>
    cartStore.quantityByProductId(productId)

  const isUpdating = computed(
    () =>
      addItem.isPending.value ||
      updateItem.isPending.value ||
      removeItem.isPending.value ||
      clearCart.isPending.value,
  )

  return {
    increment,
    setQuantity,
    decrement,
    remove,
    clear,
    quantityOf,
    isUpdating,
  }
}
