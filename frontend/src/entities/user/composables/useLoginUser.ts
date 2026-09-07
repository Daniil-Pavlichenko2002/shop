import { type AuthResponse, userApiInstance } from '@/entities/user'
import { useMutation } from '@tanstack/vue-query'
import { Status } from '@/shared'

export const useLoginUser = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string
      password: string
    }): Promise<AuthResponse> => {
      const response = await userApiInstance.login(data)
      if (response.status === Status.Error) {
        throw new Error('Не удалось авторизоваться')
      }
      return response.result as AuthResponse
    },
  })
}
