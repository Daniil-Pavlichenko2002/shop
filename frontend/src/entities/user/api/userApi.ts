import { ApiWrapper } from '@/shared'
import type { AuthResponse } from '@/entities/user'

export class UserApi extends ApiWrapper {
  getMe() {
    return this.handleRequest<any>(this._baseApi.Get('/me'))
  }
  login(data: { email: string; password: string }) {
    return this.handleRequest<AuthResponse>(this._baseApi.Post('/login', data))
  }
}
