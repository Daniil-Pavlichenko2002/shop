<script setup lang="ts">
import AppHeader from '@/widgets/header/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <app-header />
    <el-container class="max-w-[1440px] w-full mx-auto px-6 py-6 flex-1 !bg-transparent">
      <el-main class="!p-0 !bg-transparent pl-6">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
:deep(.el-radio__input.is-checked .el-radio__inner),
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.el-pager li.is-active) {
  background-color: #2563eb !important;
  color: white !important;
  border-radius: 0.5rem;
}
:deep(.el-pager li:hover:not(.is-active)) {
  color: #2563eb;
}
:deep(.btn-prev),
:deep(.btn-next) {
  border-radius: 0.5rem !important;
}

/* Кнопки "В корзину" и "Сбросить" - outline стиль */
:deep(.el-button--default) {
  border-color: #bfdbfe;
  color: #2563eb;
}
:deep(.el-button--default:hover) {
  background-color: #eff6ff;
  border-color: #93c5fd;
  color: #1d4ed8;
}

/* Убираем лишние фоны у el-container/aside/main чтобы работал bg-gray-50 родителя */
:deep(.el-container),
:deep(.el-aside),
:deep(.el-main) {
  background-color: transparent !important;
}
</style>
