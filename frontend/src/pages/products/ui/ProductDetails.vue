<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductByIdQuery } from '@/entities/products'
import {
  ProductDetailsSkeleton,
  ProductBaseInfo,
  ProductInfo,
} from '@/features/product'
import { ErrorState } from '@/shared'
import { useCartActions } from '@/entities/cart'

const { increment, decrement, quantityOf, isUpdating } = useCartActions()
const router = useRouter()
const route = useRoute()

const productId = computed(() => Number(route.params.id))

const quantity = computed(() => quantityOf(productId.value))

const {
  data: product,
  isLoading,
  isError,
  error,
} = useProductByIdQuery(productId)

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <el-button
      @click="goBack"
      text
      size="large"
      class="!mb-6 !px-0"
      :icon="ArrowLeft"
    >
      Назад к товарам
    </el-button>
    <template v-if="isLoading">
      <ProductDetailsSkeleton />
    </template>

    <template v-else-if="isError">
      <ErrorState
        title="Не удалось загрузить товар"
        description="Произошла ошибка при загрузке информации о товаре. Попробуйте обновить страницу или вернуться к списку товаров."
        :message="error?.message"
        @back="goBack"
        @retry="$router.go(0)"
      />
    </template>

    <template v-else-if="product">
      <ProductBaseInfo
        :quantity="quantity"
        :product="product"
        :is-loading="isUpdating"
        @add="increment(productId)"
        @remove="decrement(productId)"
      />
      <ProductInfo :product="product" />
    </template>
  </div>
</template>
