<script setup lang="ts"></script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <!-- Image skeleton -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item
            variant="image"
            class="!w-full !h-auto !aspect-square !rounded-xl"
          />
        </template>
      </el-skeleton>
    </div>

    <!-- Content skeleton -->
    <div class="flex flex-col">
      <el-skeleton animated>
        <template #template>
          <!-- Category -->
          <el-skeleton-item variant="text" class="!w-24 !h-6 !mb-4" />

          <!-- Title -->
          <el-skeleton-item variant="h1" class="!w-4/5 !h-10 !mb-3" />

          <el-skeleton-item variant="h1" class="!w-3/5 !h-10 !mb-6" />

          <!-- Price -->
          <el-skeleton-item variant="h3" class="!w-40 !h-10 !mb-6" />

          <!-- Stock -->
          <el-skeleton-item variant="text" class="!w-32 !h-8 !mb-6" />

          <!-- Description -->
          <el-skeleton-item variant="h3" class="!w-24 !h-6 !mb-3" />

          <el-skeleton-item variant="text" class="!w-full !h-5 !mb-2" />

          <el-skeleton-item variant="text" class="!w-full !h-5 !mb-2" />

          <el-skeleton-item variant="text" class="!w-4/5 !h-5" />

          <!-- Buy section -->
          <div class="border-t border-gray-200 mt-8 pt-6">
            <div class="flex gap-4">
              <el-skeleton-item variant="button" class="!w-32 !h-10" />

              <el-skeleton-item variant="button" class="flex-1 !h-10" />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>

  <!-- Info skeleton -->
  <div class="mt-10 bg-white rounded-2xl border border-gray-200 p-6">
    <el-skeleton animated>
      <template #template>
        <el-skeleton-item variant="h3" class="!w-56 !h-7 !mb-6" />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
          <el-skeleton-item
            v-for="i in 6"
            :key="i"
            variant="text"
            class="!w-full !h-6"
          />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped></style>
