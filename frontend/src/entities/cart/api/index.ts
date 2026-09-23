import { api } from '@/shared'
import { CartApi } from '@/entities/cart/api/cartApi.ts'

export const cartApiInstance = new CartApi(api)
