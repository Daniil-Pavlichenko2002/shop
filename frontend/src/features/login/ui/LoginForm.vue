<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

interface LoginForm {
  email: string
  password: string
}

defineProps<{
  error: boolean
}>()

const form = defineModel<LoginForm>('form', { required: true })

const ruleFormRef = ref<FormInstance>()

const submitForm = async () => {
  if (!ruleFormRef.value) return
  try {
    await ruleFormRef.value.validate()
    return true
  } catch (e) {
    return false
  }
}

const rules = reactive({
  email: [
    {
      required: true,
      message: 'Введите email',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: 'Введите пароль',
      trigger: 'blur',
    },
  ],
})

const resetForm = () => {
  ruleFormRef.value?.resetFields()
}

defineExpose({
  submitForm,
  resetForm,
})
</script>

<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto">
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>

    <el-form-item label="Пароль" prop="password">
      <el-input v-model="form.password" type="password" show-password />
    </el-form-item>
  </el-form>
  <el-alert
    v-if="error"
    title="Неправильный логин или пароль"
    type="error"
    show-icon
    :closable="false"
  />
</template>
