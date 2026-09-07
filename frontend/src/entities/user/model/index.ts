export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR'

export type TokenType = 'access' | 'refresh'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  createdAt: string
}

export interface AuthResponse {
  status: number
  result: {
    accessToken: string
    refreshToken: string
    user: User
  }
}
