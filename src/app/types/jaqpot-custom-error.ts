export class JaqpotCustomError extends Error {
  constructor(
    readonly message: string,
    readonly status: number,
  ) {
    super();
  }
}
