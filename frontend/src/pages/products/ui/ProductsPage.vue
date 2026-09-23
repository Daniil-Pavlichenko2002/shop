<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ProductOrder, ProductSort } from '@/entities/products'
import { ProductCard, ProductFilterForm } from '@/features/product'
import { getProductFilterLabel } from '@/entities/products/lib'
import { ErrorState } from '@/shared'
import { useProductsPage } from '@/pages/products/lib'
import { useCartActions } from '@/entities/cart'

const { increment, quantityOf, isUpdating } = useCartActions()

const {
  query,
  page,
  sort,
  drawerVisible,
  isLoading,
  isError,
  products,
  formFilters,
  submit,
  goBack,
  reset,
  order,
  categories,
  categoriesLoading,
} = useProductsPage()
</script>

<template>
  <div class="flex items-center gap-4 mb-6">
    <el-input
      v-model="query"
      placeholder="Поиск товаров..."
      size="large"
      class="flex-1"
      :prefix-icon="Search"
    />
    <el-select
      v-model="sort"
      placeholder="Сортировка"
      size="large"
      class="!w-[220px]"
    >
      <el-option
        v-for="key in ProductSort"
        :label="getProductFilterLabel(key)"
        :value="key"
      />
    </el-select>
    <el-radio-group class="mx-3" v-model="order">
      <el-radio
        class="-ml-5"
        v-for="key in ProductOrder"
        :key="key"
        :value="key"
      >
        {{ key }}
      </el-radio>
    </el-radio-group>
    <el-button type="primary" size="large" @click="drawerVisible = true">
      Фильтры
    </el-button>
  </div>

  <div
    v-if="isLoading"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8"
  >
    <article
      v-for="i in 8"
      class="bg-white rounded-xl border border-gray-200 p-4 flex flex-col"
    >
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item
            variant="image"
            class="!w-full !h-64 !aspect-square !rounded-lg mb-4"
          />
          <el-skeleton-item variant="h3" class="!w-3/4 !h-5 mb-2" />
          <el-skeleton-item variant="text" class="!w-1/3 !h-6 mb-2" />
          <el-skeleton-item variant="text" class="!w-20 !h-6 mb-4" />
          <el-skeleton-item variant="button" class="!w-full !h-10" />
        </template>
      </el-skeleton>
    </article>
  </div>

  <template v-else-if="isError">
    <ErrorState
      title="Не удалось загрузить товары"
      description="Произошла ошибка при загрузке списка товаров. Попробуйте обновить страницу или вернуться к списку товаров."
      @back="goBack"
      @retry="$router.go(0)"
    />
  </template>

  <TransitionGroup
    name="products"
    tag="div"
    v-else
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8"
    appear
  >
    <ProductCard
      v-for="product in products?.items ?? []"
      :key="product.id"
      :product="product"
      :quantity="quantityOf(product.id)"
      :is-loading="isUpdating"
      @add="increment"
    />
  </TransitionGroup>
  <div class="flex justify-center mt-2">
    <el-pagination
      v-model:current-page="page._page"
      :page-size="page._limit"
      :total="products?.totalCount"
      layout="prev, pager, next"
      background
      prev-text="<"
      next-text=">"
    />
  </div>
  <el-drawer v-model="drawerVisible" title="Фильтры" size="30%" direction="ltr">
    <ProductFilterForm
      v-model:form="formFilters"
      :loading="categoriesLoading"
      :categories="categories ?? []"
      @reset="reset"
      @submit="submit"
    />
  </el-drawer>
</template>

<style scoped>
:deep(.products-enter-from),
:deep(.products-leave-to) {
  opacity: 0;
  transform: translateY(-30px);
}
:deep(.products-enter-active),
:deep(.products-leave-active) {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
:deep(.products-move) {
  transition: transform 0.5s ease;
}
</style>
