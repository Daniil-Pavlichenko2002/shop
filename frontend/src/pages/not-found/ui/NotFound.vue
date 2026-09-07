<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="not-found-page">
    <el-result icon="warning" title="404" sub-title="Страница, которую вы ищете, не существует">
      <template #extra>
        <el-button type="primary" @click="goHome"> На главную </el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
