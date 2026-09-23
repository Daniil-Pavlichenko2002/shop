<script setup lang="ts">
import { formatPrice } from '@/shared'

defineProps<{
  totalCount: number
  totalAmount: number
  isUpdating: boolean
}>()

const emit = defineEmits<{
  clear: []
}>()
</script>

<template>
  <aside
    class="bg-white rounded-xl border border-gray-200 p-5 lg:sticky lg:top-24"
  >
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Итого</h2>
    <div class="flex justify-between text-sm text-gray-600 mb-2">
      <span>Товары</span>
      <span>{{ totalCount }} шт.</span>
    </div>
    <div class="flex justify-between text-xl font-semibold text-gray-900 mb-6">
      <span>Сумма</span>
      <span>{{ formatPrice(totalAmount) }}</span>
    </div>
    <el-button type="primary" size="large" class="!w-full !mb-2">
      Оформить заказ
    </el-button>
    <el-button
      size="large"
      class="!w-full !ml-0"
      :loading="isUpdating"
      @click="emit('clear')"
    >
      Очистить корзину
    </el-button>
  </aside>
</template>

<style scoped></style>
