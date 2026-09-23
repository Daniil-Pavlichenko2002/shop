import { ApiWrapper } from '@/shared'
import type {
  AddCartItemBody,
  Cart,
  CartInfo,
  UpdateCartItemBody,
} from '@/entities/cart/model'

export class CartApi extends ApiWrapper {
  getCart() {
    return this.handleRequest<Cart>(this._baseApi.Get('/cart'))
  }

  getCartInfo() {
    return this.handleRequest<CartInfo>(this._baseApi.Get('/cart/info'))
  }

  addItem(data: AddCartItemBody) {
    return this.handleRequest<Cart>(this._baseApi.Post('/cart/items', data))
  }

  updateItem(productId: number, data: UpdateCartItemBody) {
    return this.handleRequest<Cart>(
      this._baseApi.Patch(`/cart/items/${productId}`, data),
    )
  }

  removeItem(productId: number) {
    return this.handleRequest<Cart>(
      this._baseApi.Delete(`/cart/items/${productId}`),
    )
  }

  clear() {
    return this.handleRequest<void>(this._baseApi.Delete('/cart'))
  }
}
