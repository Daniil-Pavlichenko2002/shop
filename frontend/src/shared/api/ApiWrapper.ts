import type { BaseApi } from '@/shared/api/BaseApi.ts'
import { CommonError, CommonResponse, Status } from '@/shared/helperClass'

export abstract class ApiWrapper {
  constructor(protected readonly _baseApi: BaseApi) {}

  protected async handleRequest<T>(
    request: Promise<[unknown, unknown]>,
    transform?: (data: unknown) => T,
  ): Promise<CommonResponse<T | CommonError>> {
    const [result, error] = await request

    if (result) {
      const payload = (result as { data?: unknown }).data
      const data = transform ? transform(payload) : (payload as T)

      return new CommonResponse<T>(Status.Success, data)
    }

    return new CommonResponse<CommonError>(Status.Error, new CommonError(error))
  }
}
