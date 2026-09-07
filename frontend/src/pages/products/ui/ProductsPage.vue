<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useProductsQueries } from '@/entities/products'
import { ProductCard } from '@/features/product'

const { data: products, isLoading } = useProductsQueries()

const sortValue = ref('price')
const searchQuery = ref('')
const currentPage = ref(1)
</script>

<template>
  <div class="flex items-center gap-4 mb-6">
    <el-input
      v-model="searchQuery"
      placeholder="Поиск товаров..."
      size="large"
      class="flex-1"
      :prefix-icon="Search"
    />
    <el-select
      v-model="sortValue"
      placeholder="Сортировка"
      size="large"
      class="!w-[220px]"
    >
      <el-option label="Сортировка: по цене" value="price" />
      <el-option label="Сортировка: по названию" value="name" />
      <el-option label="Сортировка: по популярности" value="popular" />
    </el-select>
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

  <div
    v-else
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8"
  >
    <ProductCard
      v-if="products?.length"
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
  <div class="flex justify-center">
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="8"
      :total="32"
      layout="prev, pager, next"
      background
      prev-text="<"
      next-text=">"
    />
  </div>
</template>

<style scoped></style>
