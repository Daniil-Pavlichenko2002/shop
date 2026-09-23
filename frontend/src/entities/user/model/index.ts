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
  accessToken: string
  refreshToken: string
  user: User
}

export interface RegisterBody {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}
