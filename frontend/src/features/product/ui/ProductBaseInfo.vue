<script setup lang="ts">
import { Check, ShoppingCart, Warning } from '@element-plus/icons-vue'
import type { Product } from '@/entities/products'
import { ref } from 'vue'
import { formatPrice } from '@/shared'

const { product } = defineProps<{ product: Product }>()
const quantity = ref(1)
const price = formatPrice(product.price)
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <div class="aspect-square rounded-xl overflow-hidden bg-gray-50">
        <img
          :src="product.imageUrl"
          :alt="product.title"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <div class="flex flex-col">
      <div class="mb-3">
        <el-tag type="info" effect="plain">
          {{ product.category.name }}
        </el-tag>
      </div>

      <h1
        class="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-5"
      >
        {{ product.title }}
      </h1>

      <div class="mb-6">
        <span class="text-4xl font-bold text-gray-900"> {{ price }} </span>
      </div>

      <div class="mb-6">
        <el-tag
          v-if="product.stock > 0"
          type="success"
          size="large"
          effect="light"
          :icon="Check"
        >
          В наличии: {{ product.stock }} шт.
        </el-tag>

        <el-tag
          v-else
          type="danger"
          size="large"
          effect="light"
          :icon="Warning"
        >
          Нет в наличии
        </el-tag>
      </div>

      <!-- Описание -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Описание</h2>

        <p class="text-gray-600 leading-7">
          {{ product.description }}
        </p>
      </div>

      <!-- Покупка -->
      <div class="mt-auto border-t border-gray-200 pt-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Количество -->
          <div class="flex items-center">
            <el-button size="large" :disabled="quantity <= 1"> − </el-button>

            <div
              class="w-14 h-10 flex items-center justify-center text-lg font-medium"
            >
              {{ quantity }}
            </div>

            <el-button size="large" :disabled="quantity >= product.stock">
              +
            </el-button>
          </div>

          <!-- Корзина -->
          <el-button
            type="primary"
            size="large"
            class="flex-1 !h-10"
            :icon="ShoppingCart"
          >
            Добавить в корзину
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
