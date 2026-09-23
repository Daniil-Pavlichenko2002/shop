export interface CartProductPreview {
  id: number
  title: string
  price: number
  stock: number
  imageUrl: string
  isPublished: boolean
}

export interface CartItem {
  productId: number
  quantity: number
  product: CartProductPreview
}

export interface Cart {
  items: CartItem[]
  totalCount: number
  totalAmount: number
}

export interface CartInfo {
  totalCount: number
  uniqueItems: number
}

export interface AddCartItemBody {
  productId: number
  quantity: number
}

export interface UpdateCartItemBody {
  quantity: number
}
