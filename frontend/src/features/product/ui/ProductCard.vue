<script setup lang="ts">
import { Picture } from '@element-plus/icons-vue'
import type { Product } from '@/entities/products'
import { formatPrice } from '@/shared'

const { product, quantity, isLoading } = defineProps<{
  product: Product
  quantity: number
  isLoading?: boolean
}>()

const emit = defineEmits<{
  add: [productId: number]
}>()
</script>

<template>
  <article
    class="bg-white rounded-xl border border-gray-200 p-4 flex flex-col hover:shadow-md transition-shadow"
  >
    <router-link :to="`/product/${product.id}`" class="block">
      <div
        class="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden"
      >
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.title"
          class="max-w-full max-h-full object-contain"
        />

        <el-icon v-else :size="64" class="text-gray-300">
          <Picture />
        </el-icon>
      </div>

      <h3 class="text-base font-semibold text-gray-900 mb-1">
        {{ product.title }}
      </h3>

      <p class="text-lg font-bold text-gray-900 mb-2">
        {{ formatPrice(product.price) }}
      </p>

      <span
        class="inline-block self-start text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5 mb-4"
      >
        {{ quantity > 0 ? `В корзине: ${quantity}` : 'В наличии' }}
      </span>
    </router-link>

    <el-button
      class="mt-auto !w-full !rounded-lg !font-medium !border-blue-200 !text-blue-600 hover:!bg-blue-50"
      size="large"
      :loading="isLoading"
      :disabled="product.stock < 1 || quantity >= product.stock"
      @click.stop="emit('add', product.id)"
    >
      В корзину
    </el-button>
  </article>
</template>
