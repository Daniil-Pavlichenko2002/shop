<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'

defineProps<{
  message?: string
}>()

const emit = defineEmits<{
  retry: []
  back: []
}>()
</script>

<template>
  <div
    class="min-h-[400px] flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-gray-200 px-6"
  >
    <div
      class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5"
    >
      <el-icon :size="32" class="text-red-500">
        <Warning />
      </el-icon>
    </div>

    <h1 class="text-xl font-semibold text-gray-900 mb-2">
      Не удалось загрузить товар
    </h1>

    <p class="text-gray-500 max-w-md mb-6">
      Произошла ошибка при загрузке информации о товаре. Попробуйте обновить
      страницу или вернуться к списку товаров.
    </p>

    <div class="flex gap-3">
      <el-button @click="emit('back')"> Назад к товарам </el-button>

      <el-button type="primary" @click="emit('retry')"> Повторить </el-button>
    </div>

    <!-- Можно убрать в production -->
    <p v-if="message" class="mt-4 text-xs text-gray-400">
      {{ message }}
    </p>
  </div>
</template>

<style scoped></style>
