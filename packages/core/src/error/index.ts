export class AppError extends Error {
  code: number;
  constructor(code: number, error: string) {
    super(error);
    this.code = code;
  }
}
