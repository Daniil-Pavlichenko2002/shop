<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/entities/cart/store/cartStore'

const { totalCount } = storeToRefs(useCartStore())
</script>

<template>
  <el-header class="bg-white border-b border-gray-200 sticky top-0 z-30 h-16">
    <div
      class="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between"
    >
      <router-link
        to="/"
        class="text-2xl font-bold text-blue-600 tracking-tight"
        >ShopMVP</router-link
      >

      <nav class="flex items-center gap-8">
        <router-link
          to="/products"
          class="text-sm font-medium pb-0.5 border-b-2 border-blue-600 text-blue-600"
          >Каталог</router-link
        >
        <router-link
          to="/cart"
          class="relative flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Корзина
          <span
            v-if="totalCount"
            class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold leading-none"
            >{{ totalCount }}</span
          >
        </router-link>
        <router-link
          to="/notifications"
          class="relative flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Уведомления
          <span
            class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 text-white text-xs font-bold leading-none"
            >4</span
          >
        </router-link>
      </nav>

      <div class="flex items-center gap-3 cursor-pointer group">
        <div
          class="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-300 transition-all"
        >
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="User"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="text-sm font-medium text-gray-700">Иван</span>
        <el-icon class="text-gray-400"><ArrowDown /></el-icon>
      </div>
    </div>
  </el-header>
</template>

<style scoped></style>
