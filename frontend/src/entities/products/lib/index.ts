export const productQueryKeys = {
  products: ['products'],
  all: () => [...productQueryKeys.products, 'all'],
  byId: (id: number) => [...productQueryKeys.products, 'byId', id],
}
