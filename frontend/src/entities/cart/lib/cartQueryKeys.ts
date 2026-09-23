export const cartQueryKeys = {
  cart: ['cart'] as const,
  detail: () => [...cartQueryKeys.cart, 'detail'] as const,
  info: () => [...cartQueryKeys.cart, 'info'] as const,
}
