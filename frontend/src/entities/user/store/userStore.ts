import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthResponse } from '@/entities/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<AuthResponse | null>(null)
  const setUser = (userValue: AuthResponse) => {
    user.value = userValue
  }

  return { user, setUser }
})
