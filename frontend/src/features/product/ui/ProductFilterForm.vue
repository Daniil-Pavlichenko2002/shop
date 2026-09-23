<script setup lang="ts">
import type { Category, ProductForm } from '@/entities/products'

defineProps<{
  categories: Category[]
  loading: boolean
}>()

const form = defineModel<ProductForm>('form', { required: true })

const emit = defineEmits<{
  reset: []
  submit: []
}>()
</script>

<template>
  <el-form class="flex flex-col gap-2">
    <p class="text-sm text-gray-500 mb-2">Категория</p>
    <el-radio-group
      class="flex flex-col gap-2 justify-start !items-start"
      v-loading="loading"
      v-model="form.categoryId"
    >
      <el-radio :value="null">Все</el-radio>
      <el-radio v-for="c in categories" :key="c.id" :value="c.id">
        {{ c.name }}
      </el-radio>
    </el-radio-group>
    <p class="text-sm text-gray-500 mt-4 mb-2">Цена, ₽</p>
    <div class="flex items-center gap-2">
      <el-input v-model.number="form.price_gte" placeholder="от" />
      <span>—</span>
      <el-input v-model.number="form.price_lte" placeholder="до" />
    </div>
    <el-checkbox v-model="form.isPublished">В наличии</el-checkbox>
    <el-button type="primary" class="w-full" @click="emit('submit')"
      >Применить</el-button
    >
    <el-button class="w-full !ml-0" @click="emit('reset')">Сбросить</el-button>
  </el-form>
</template>

<style scoped></style>
