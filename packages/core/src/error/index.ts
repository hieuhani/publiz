export class AppError extends Error {
  code: number;
  extra?: any;
  constructor(code: number, error: string, extra?: any) {
    super(error);
    this.code = code;
    this.extra = extra;
  }
}
