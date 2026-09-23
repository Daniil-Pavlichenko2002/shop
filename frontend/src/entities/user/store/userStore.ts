import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/entities/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const setUser = (userValue: User) => {
    user.value = userValue
  }

  const clearUser = () => {
    user.value = null
  }

  return { user, setUser, clearUser }
})
