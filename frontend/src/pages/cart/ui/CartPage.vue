<script setup lang="ts">
import { computed } from 'vue'
import { useCartActions, useCartStore } from '@/entities/cart'
import { storeToRefs } from 'pinia'
import { CartItem, CartAside } from '@/features/cart'

const cartStore = useCartStore()
const { cart, totalCount } = storeToRefs(cartStore)
const { setQuantity, remove, clear, isUpdating } = useCartActions()

const items = computed(() => cart.value?.items ?? [])

const totalAmount = computed(() =>
  items.value.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  ),
)
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl font-semibold text-gray-900">Корзина</h1>
    <p class="text-sm text-gray-500 mt-1">
      Проверьте товары перед оформлением заказа
    </p>
  </div>

  <el-empty
    v-if="!items.length"
    description="В корзине пока пусто"
    class="bg-white rounded-xl border border-gray-200 py-16"
  >
    <el-button type="primary" @click="$router.push({ name: 'products' })">
      Перейти в каталог
    </el-button>
  </el-empty>

  <div
    v-else
    class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start"
  >
    <div class="flex flex-col gap-4">
      <CartItem
        v-for="item in items"
        :key="item.productId"
        :is-updating="isUpdating"
        :item="item"
        @update:quantity="setQuantity(item.productId, $event)"
        @remove="remove(item.productId)"
      />
    </div>

    <CartAside
      :total-count="totalCount"
      :total-amount="totalAmount"
      :is-updating="isUpdating"
      @clear="clear"
    />
  </div>
</template>
