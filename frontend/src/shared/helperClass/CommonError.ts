export class CommonError {
  private readonly _data: unknown

  constructor(data: unknown) {
    this._data = data
  }

  get data(): unknown {
    return this._data
  }

  get Message(): string {
    const payload = this._data as {
      response?: { data?: { message?: string } }
    } | null

    return JSON.stringify(payload?.response?.data?.message)
  }
}
