import { ApiWrapper } from '@/shared'
import type {
  Category,
  Product,
  ProductBody,
  ProductListParams,
} from '@/entities/products'

export class ProductsApi extends ApiWrapper {
  getProducts(params?: ProductListParams) {
    return this.handleRequest<{ items: Product[]; totalCount: number }>(
      this._baseApi.Get('/products', params),
      (data, response) => {
        const headers = (response as { headers: Record<string, string> })
          .headers
        const totalCount = headers['x-total-count']
        return {
          items: data as Product[],
          totalCount: totalCount ? Number(totalCount) : 0,
        }
      },
    )
  }
  getProductById(id: number) {
    return this.handleRequest<Product>(this._baseApi.Get(`/products/${id}`))
  }
  create(data: ProductBody) {
    return this.handleRequest<Product>(this._baseApi.Post('/products', data))
  }
  update(id: number, data: Partial<ProductBody>) {
    return this.handleRequest<Product>(
      this._baseApi.Patch(`/products/${id}`, data),
    )
  }
  delete(id: number) {
    return this.handleRequest<void>(this._baseApi.Delete(`/products/${id}`))
  }
  getCategories() {
    return this.handleRequest<Category[]>(this._baseApi.Get('/categories'))
  }
  createCategory(data: { name: string; slug?: string }) {
    return this.handleRequest<Category>(this._baseApi.Post('/categories', data))
  }
}
