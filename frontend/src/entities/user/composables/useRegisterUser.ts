import {
  type AuthResponse,
  type RegisterBody,
  userApiInstance,
} from '@/entities/user'
import { useMutation } from '@tanstack/vue-query'
import { Status } from '@/shared'

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (data: RegisterBody): Promise<AuthResponse> => {
      const response = await userApiInstance.register(data)
      if (response.status === Status.Error) {
        throw new Error('Не удалось зарегистрироваться')
      }
      return response.result as AuthResponse
    },
  })
}
