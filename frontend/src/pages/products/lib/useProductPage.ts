import { computed, reactive, ref, watch } from 'vue'
import {
  ProductOrder,
  type ProductOrderType,
  ProductSort,
  type ProductSortType,
  useCategoriesQueries,
  useProductsQueries,
} from '@/entities/products'
import { debounce } from '@/shared'
import { createDefaultProductListParams } from '@/entities/products/lib'

export const useProductsPage = () => {
  const page = reactive({
    _page: 1,
    _limit: 8,
  })

  const query = ref('')
  const q = ref('')
  const sort = ref<ProductSortType>(ProductSort.Price)
  const order = ref<ProductOrderType>(ProductOrder.Asc)
  const searchDebounce = debounce((value: string) => {
    q.value = value
  }, 300)

  watch(query, (value) => {
    searchDebounce(value)
  })

  const defaultListParams = reactive(createDefaultProductListParams())
  const formFilters = reactive(createDefaultProductListParams())

  const productListParams = computed(() => ({
    q: q.value,
    _page: page._page,
    _limit: page._limit,
    _sort: sort.value,
    _order: order.value,
    ...defaultListParams,
  }))

  const {
    data: products,
    isLoading,
    isError,
  } = useProductsQueries(productListParams)

  const { data: categories, isLoading: categoriesLoading } =
    useCategoriesQueries()

  const drawerVisible = ref(false)

  const submit = () => {
    Object.assign(defaultListParams, { ...formFilters })
    drawerVisible.value = false
  }
  const reset = () => {
    Object.assign(formFilters, { ...createDefaultProductListParams() })
    Object.assign(defaultListParams, { ...createDefaultProductListParams() })
  }

  const goBack = () => {}

  return {
    drawerVisible,
    order,
    submit,
    reset,
    goBack,
    products,
    isLoading,
    isError,
    page,
    query,
    sort,
    formFilters,
    categories,
    categoriesLoading,
  }
}
