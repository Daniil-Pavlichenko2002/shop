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
