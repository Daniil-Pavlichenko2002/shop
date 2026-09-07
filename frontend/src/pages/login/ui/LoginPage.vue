<script setup lang="ts">
import { ref } from 'vue'
import { useLoginPage } from '@/pages/login/lib'
import LoginForm from '@/features/login/ui/LoginForm.vue'

const loginFormRef = ref<InstanceType<typeof LoginForm>>()

const { form, error, isLoading, handleLogin } = useLoginPage()

const submitForm = async () => {
  const isValid = await loginFormRef.value?.submitForm()

  if (!isValid) return

  await handleLogin()
}

const resetForm = () => {
  loginFormRef.value?.resetForm()
}
</script>

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

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}
</style>
