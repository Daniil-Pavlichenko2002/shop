import type { RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/entities/user/store/userStore'
import { storeToRefs } from 'pinia'
import { ACCESS_TOKEN_KEY } from '@/shared'

export const isAuthenticated = (to: RouteLocationNormalized) => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const isAuth = !!user.value || !!accessToken

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
