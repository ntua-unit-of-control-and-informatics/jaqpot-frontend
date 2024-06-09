export class CustomError extends Error {
  constructor(
    readonly message: string,
    readonly status: number,
  ) {
    super();
  }
}
