import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { Status } from '@/shared'
import type {
  AddCartItemBody,
  Cart,
  UpdateCartItemBody,
} from '@/entities/cart/model'
import { cartApiInstance } from '@/entities/cart/api'
import { applyCartAndBroadcast, cartQueryKeys, getCartChannel } from '@/entities/cart/lib'
import { useCartStore } from '@/entities/cart/store/cartStore'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/entities/user'

const publishCart = (queryClient: ReturnType<typeof useQueryClient>, cart: Cart) => {
  applyCartAndBroadcast(queryClient, getCartChannel(), cart, useUserStore().user?.id ?? null)
}

const unwrapCart = (
  response: { status: Status; result: unknown },
  errorMessage: string,
) => {
  if (response.status === Status.Error) {
    ElMessage.error(errorMessage)
    throw new Error(errorMessage)
  }
  return response.result as Cart
}

export const useAddCartItem = () => {
  const queryClient = useQueryClient()
  const cartStore = useCartStore()

  return useMutation({
    mutationFn: async (data: AddCartItemBody): Promise<Cart> => {
      const response = await cartApiInstance.addItem(data)
      return unwrapCart(response, 'Не удалось добавить товар в корзину')
    },
    onSuccess: (cart) => {
      publishCart(queryClient, cart)
    },
  })
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()
  const cartStore = useCartStore()

  return useMutation({
    mutationFn: async (data: AddCartItemBody): Promise<Cart> => {
      const body: UpdateCartItemBody = { quantity: data.quantity }
      const response = await cartApiInstance.updateItem(data.productId, body)
      return unwrapCart(response, 'Не удалось изменить количество')
    },
    onSuccess: (cart) => {
      publishCart(queryClient, cart)
    },
  })
}

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()
  const cartStore = useCartStore()

  return useMutation({
    mutationFn: async (productId: number): Promise<Cart> => {
      const response = await cartApiInstance.removeItem(productId)
      return unwrapCart(response, 'Не удалось удалить товар из корзины')
    },
    onSuccess: (cart) => {
      publishCart(queryClient, cart)
    },
  })
}

export const useClearCart = () => {
  const queryClient = useQueryClient()
  const cartStore = useCartStore()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const response = await cartApiInstance.clear()
      if (response.status === Status.Error) {
        throw new Error('Не удалось очистить корзину')
      }
    },
    onSuccess: () => {
      const emptyCart: Cart = {
        items: [],
        totalCount: 0,
        totalAmount: 0,
      }
      publishCart(queryClient, emptyCart)
    },
  })
}
