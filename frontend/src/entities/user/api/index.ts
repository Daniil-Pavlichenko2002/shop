import { api } from '@/shared'
import { UserApi } from '@/entities/user/api/userApi.ts'

export const userApiInstance = new UserApi(api)
