import { ApiWrapper } from '@/shared'
import type { AuthResponse, User } from '@/entities/user'

export class UserApi extends ApiWrapper {
  login(data: { email: string; password: string }) {
    return this.handleRequest<AuthResponse>(this._baseApi.Post('/login', data))
  }

  register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) {
    return this.handleRequest<AuthResponse>(
      this._baseApi.Post('/register', data),
    )
  }

  refresh(refreshToken: string) {
    return this.handleRequest<AuthResponse>(
      this._baseApi.Post('/refresh', { refreshToken }),
    )
  }

  logout(refreshToken?: string) {
    return this.handleRequest<void>(
      this._baseApi.Post('/logout', { refreshToken }),
    )
  }

  getById(id: number) {
    return this.handleRequest<User>(this._baseApi.Get(`/users/${id}`))
  }

  update(
    id: number,
    data: { firstName?: string; lastName?: string; phone?: string | null },
  ) {
    return this.handleRequest<User>(this._baseApi.Patch(`/users/${id}`, data))
  }
}
