import { api } from '@/shared'
import { ProductsApi } from '@/entities/products/api/productsApi.ts'

export const productsApiInstance = new ProductsApi(api)
