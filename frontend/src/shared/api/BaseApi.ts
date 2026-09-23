import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/shared'

export class BaseApi {
  private readonly axiosInstance: AxiosInstance
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
    })

    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        const status = error.response?.status
        const url = originalRequest?.url ?? ''

        const isAuthUrl =
          url.includes('/login') ||
          url.includes('/register') ||
          url.includes('/refresh') ||
          url.includes('/logout')

        const shouldTryRefresh =
          status === 401 && !originalRequest._retry && !isAuthUrl

        if (!shouldTryRefresh) return Promise.reject(error)

        originalRequest._retry = true

        try {
          const accessToken = await this.refreshSession()
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return this.axiosInstance(originalRequest)
        } catch (error) {
          this.ClearSession()

          const { useUserStore } =
            await import('@/entities/user/store/userStore')
          const { default: router } = await import('@/app/router/router')
          useUserStore().clearUser()

          const currentRoute = router.currentRoute.value.name
          if (currentRoute !== 'login') {
            router.push({ name: 'login' })
          }

          return Promise.reject(error)
        }
      },
    )
  }

  get axios() {
    return this.axiosInstance
  }

  private ClearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  private refreshSession() {
    if (!this.refreshPromise) {
      this.refreshPromise = this.doRefresh().finally(() => {
        this.refreshPromise = null
      })
    }
    return this.refreshPromise
  }

  private async doRefresh() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) {
      throw new Error('No refresh token')
    }
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/refresh`,
      { refreshToken },
    )
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)

    return data.accessToken
  }

  async Get<T, TParams extends object>(url: string, params?: TParams) {
    return this.Send(this.axiosInstance.get<T>(url, { params }))
  }

  async Post<TResponse, TBody>(url: string, body: TBody) {
    return this.Send(this.axiosInstance.post<TResponse>(url, body))
  }

  Put<TResponse, TBody>(url: string, body: TBody) {
    return this.Send(this.axiosInstance.put<TResponse>(url, body))
  }

  Patch<TResponse, TBody>(url: string, body: TBody) {
    return this.Send(this.axiosInstance.patch<TResponse>(url, body))
  }

  Delete<TResponse>(url: string) {
    return this.Send(this.axiosInstance.delete<TResponse>(url))
  }

  public async Send<T>(promise: Promise<T>): Promise<[T | null, unknown]> {
    let result: T | null = null
    let error: unknown = null

    try {
      const tempResult: unknown = await promise

      if (
        tempResult &&
        typeof tempResult === 'object' &&
        'data' in tempResult &&
        tempResult.data &&
        typeof tempResult.data === 'object' &&
        'errors' in tempResult.data
      ) {
        error = tempResult.data
        result = null
      } else {
        result = tempResult as T
      }
    } catch (_error) {
      error = _error
    }

    return [result, error]
  }
}
