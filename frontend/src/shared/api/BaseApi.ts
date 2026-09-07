import type { AxiosInstance } from 'axios'
import axios from 'axios'

export class BaseApi {
  private readonly axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3001',
    })
  }

  get axios() {
    return this.axiosInstance
  }

  async Get<T>(url: string) {
    return this.Send(this.axiosInstance.get<T>(url))
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
