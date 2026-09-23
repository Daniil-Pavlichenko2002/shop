<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { formatPrice } from '@/shared'
import type { CartItem } from '@/entities/cart'

defineProps<{
  item: CartItem
  isUpdating: boolean
}>()

const emit = defineEmits<{
  remove: [productId: number]
  'set-quantity': [productId: number, quantity: number]
}>()
</script>

<template>
  <article
    :key="item.productId"
    class="bg-white rounded-xl border border-gray-200 p-4 flex gap-4"
  >
    <router-link
      :to="`/product/${item.productId}`"
      class="w-28 h-28 shrink-0 rounded-lg bg-gray-100 overflow-hidden"
    >
      <img
        :src="item.product.imageUrl"
        :alt="item.product.title"
        class="w-full h-full object-cover"
      />
    </router-link>

    <div class="flex-1 min-w-0 flex flex-col">
      <div class="flex items-start justify-between gap-3">
        <router-link
          :to="`/product/${item.productId}`"
          class="font-medium text-gray-900 hover:text-blue-600"
        >
          {{ item.product.title }}
        </router-link>
        <el-button
          :icon="Delete"
          text
          type="danger"
          :disabled="isUpdating"
          @click="emit('remove', item.productId)"
        />
      </div>

      <p class="text-sm text-gray-500 mt-1">
        {{ formatPrice(item.product.price) }} · в наличии
        {{ item.product.stock }} шт.
      </p>

      <div class="mt-auto pt-3 flex items-center justify-between gap-3">
        <el-input-number
          :model-value="item.quantity"
          :min="1"
          :max="item.product.stock"
          size="default"
          :disabled="isUpdating"
          @change="
            (value: number | undefined) =>
              value != null && emit('set-quantity', item.productId, value)
          "
        />
        <p class="text-lg font-semibold text-gray-900">
          {{ formatPrice(item.product.price * item.quantity) }}
        </p>
      </div>
    </div>
  </article>
</template>
