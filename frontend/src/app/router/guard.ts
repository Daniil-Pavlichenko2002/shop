import type { RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/entities/user/store/userStore'
import { storeToRefs } from 'pinia'

export const isAuthenticated = (to: RouteLocationNormalized) => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const storedUser = localStorage.getItem('user')
  const isAuth = !!user.value || !!storedUser

  if (to.name === 'login' && isAuth) {
    return {
      name: 'home',
    }
  }

  if (!to.meta.requiresAuth) {
    return true
  }

  if (!isAuth) {
    return {
      name: 'login',
    }
  }

  return true
}
