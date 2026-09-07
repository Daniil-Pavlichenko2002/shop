export enum Status {
  Success,
  Error,
}

export class CommonResponse<T> {
  constructor(
    public readonly status: Status,
    public readonly result: T,
  ) {}

  public get IsSuccess(): boolean {
    return this.status === Status.Success
  }
}
