export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = "BAD_REQUEST",
  ) {
    super(message);
    this.name = "AppError";
  }
}
