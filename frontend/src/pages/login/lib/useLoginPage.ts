import { useRouter } from 'vue-router'
import { useLoginUser, useUserStore } from '@/entities/user'
import { reactive, ref } from 'vue'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/shared'

interface Form {
  email: string
  password: string
}

export const useLoginPage = () => {
  const router = useRouter()
  const userStore = useUserStore()
  const login = useLoginUser()

  const error = ref(false)

  const form = reactive<Form>({
    email: 'user@shop.test',
    password: 'password123',
  })

  const handleLogin = async () => {
    error.value = false
    try {
      const authResponse = await login.mutateAsync({ ...form })
      if (!authResponse) return
      localStorage.setItem(ACCESS_TOKEN_KEY, authResponse.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken)
      userStore.setUser(authResponse.user)
      await router.push({ name: 'home' })
    } catch (e) {
      console.log(e)
      error.value = true
    }
  }

  return {
    form,
    error,
    isLoading: login.isPending,
    handleLogin,
  }
}
