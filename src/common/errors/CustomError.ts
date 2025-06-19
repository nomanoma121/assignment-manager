export type ErrorCode =
  | 'INVALID_INPUT'
  | 'TASK_NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'DATABASE_ERROR'
  | 'DISCORD_API_ERROR'
  | 'UNKNOWN_ERROR';

export class CustomError extends Error {
  public readonly code: ErrorCode;
  public readonly timestamp: Date;

  constructor(message: string, code: ErrorCode = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.timestamp = new Date();
    Error.captureStackTrace(this, CustomError);
  }

  public toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}
