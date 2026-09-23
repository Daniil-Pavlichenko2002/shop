export const ProductSort = {
  Price: 'price',
  CreatedAt: 'createdAt',
  Title: 'title',
  Id: 'id',
} as const
export const ProductOrder = {
  Asc: 'asc',
  Desc: 'desc',
} as const

export type ProductSortType = (typeof ProductSort)[keyof typeof ProductSort]
export type ProductOrderType = (typeof ProductOrder)[keyof typeof ProductOrder]

export interface Product {
  id: number
  title: string
  description: string
  categoryId: number
  price: number
  stock: number
  isPublished: boolean
  imageUrl: string
  createdAt: string
  updatedAt: string
  category: Category
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface ProductListParams {
  q?: string
  categoryId?: number
  price_gte?: number
  price_lte?: number
  isPublished?: boolean
  _sort?: ProductSortType
  _order?: ProductOrderType
  _page?: number
  _limit?: number
}

export type ProductForm = Omit<
  ProductListParams,
  '_page' | '_limit' | '_sort' | '_order' | 'q'
>

export interface ProductBody {
  title: string
  description: string
  categoryId: number
  price: number
  stock: number
  imageUrl: string
  isPublished?: boolean
}
export interface ProductResponse {
  items: Product[]
  totalCount: number
}
