<script setup lang="ts"></script>

<template>
  <el-container class="auth-layout">
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style scoped>
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
}
</style>
