<script setup lang="ts">
import type { Product } from '@/entities/products'

defineProps<{ product: Product }>()
</script>

<template>
  <div class="mt-10 bg-white rounded-2xl border border-gray-200 p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-5">
      Информация о товаре
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
      <div class="flex justify-between border-b border-gray-100 pb-3">
        <span class="text-gray-500">Категория</span>

        <span class="font-medium text-gray-900">
          {{ product.category.name }}
        </span>
      </div>

      <div class="flex justify-between border-b border-gray-100 pb-3">
        <span class="text-gray-500">Артикул</span>

        <span class="font-medium text-gray-900"> #{{ product.id }} </span>
      </div>

      <div class="flex justify-between border-b border-gray-100 pb-3">
        <span class="text-gray-500">Количество на складе</span>

        <span class="font-medium text-gray-900"> {{ product.stock }} шт. </span>
      </div>

      <div class="flex justify-between border-b border-gray-100 pb-3">
        <span class="text-gray-500">Статус</span>

        <el-tag :type="product.isPublished ? 'success' : 'info'" size="small">
          {{ product.isPublished ? 'Опубликован' : 'Скрыт' }}
        </el-tag>
      </div>

      <div class="flex justify-between border-b border-gray-100 pb-3">
        <span class="text-gray-500">Дата добавления</span>

        <span class="font-medium text-gray-900">
          {{ new Date(product.createdAt).toLocaleDateString('ru-RU') }}
        </span>
      </div>

      <div class="flex justify-between border-b border-gray-100 pb-3">
        <span class="text-gray-500">Последнее обновление</span>

        <span class="font-medium text-gray-900">
          {{ new Date(product.updatedAt).toLocaleDateString('ru-RU') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
