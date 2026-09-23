import { ProductSort, type ProductSortType } from '@/entities/products'

export const getProductFilterLabel = (filter: ProductSortType): string => {
  const labels: Record<ProductSortType, string> = {
    [ProductSort.Price]: 'по цене',
    [ProductSort.CreatedAt]: 'по дате создания',
    [ProductSort.Title]: 'по названию',
    [ProductSort.Id]: 'по ID',
  }
  return labels[filter]
}
