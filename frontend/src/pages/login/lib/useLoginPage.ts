import { useRouter } from 'vue-router'
import { useLoginUser, useUserStore } from '@/entities/user'
import { reactive, ref } from 'vue'

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

      localStorage.setItem('user', JSON.stringify(authResponse))
      userStore.setUser(authResponse)

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
