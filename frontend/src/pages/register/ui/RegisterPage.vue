<script setup lang="ts">
import LoginForm from '@/features/login/ui/LoginForm.vue'
import { reactive, ref } from 'vue'

const form = reactive({
  email: 'user@shop.test',
  password: 'password123',
})

const error = ref(false)
const isLoading = ref(false)

const submitForm = () => {}

const resetForm = () => {}
</script>

<template>
  <template>
    <div class="login-page">
      <el-card class="w-120">
        <template #header> Войти </template>
        <LoginForm ref="loginFormRef" v-model:form="form" :error="error" />
        <template #footer>
          <el-button :loading="isLoading" type="primary" @click="submitForm">
            Войти
          </el-button>

          <el-button type="primary" :disabled="isLoading" @click="resetForm">
            Сбросить
          </el-button>
        </template>
      </el-card>
    </div>
  </template>
</template>

<style scoped></style>
