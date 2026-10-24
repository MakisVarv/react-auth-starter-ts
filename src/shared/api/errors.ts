export class AppError extends Error {
  status: number | null;
  errors: Record<string, string[]> | null;
  constructor(
    message: string,
    status: number | null = null,
    errors: Record<string, string[]> | null = null,
  ) {
    super(message);

    this.name = "AppError";
    this.status = status;
    this.errors = errors;
  }
}
