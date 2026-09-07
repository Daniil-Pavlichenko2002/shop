import { ApiWrapper } from '@/shared'
import type { Product } from '@/entities/products'

export class ProductsApi extends ApiWrapper {
  getProducts() {
    return this.handleRequest<Product[]>(this._baseApi.Get('/products'))
  }
  getProductById(id: number) {
    return this.handleRequest<Product>(this._baseApi.Get(`/products/${id}`))
  }
}
