export type ErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'CONFLICT'
  | 'BAD_REQUEST';

export interface ApiError {
  error: {
    code: ErrorCode;
    message: string;
    fields?: Record<string, string>;
  };
}

export class ApiErrorClass extends Error {
  code: ErrorCode;
  fields?: Record<string, string>;

  constructor(code: ErrorCode, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.fields = fields;
  }

  toJSON(): ApiError {
    return {
      error: {
        code: this.code,
        message: this.message,
        fields: this.fields,
      },
    };
  }
}

export const errorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED' as ErrorCode,
  FORBIDDEN: 'FORBIDDEN' as ErrorCode,
  NOT_FOUND: 'NOT_FOUND' as ErrorCode,
  VALIDATION_ERROR: 'VALIDATION_ERROR' as ErrorCode,
  INTERNAL_ERROR: 'INTERNAL_ERROR' as ErrorCode,
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED' as ErrorCode,
  CONFLICT: 'CONFLICT' as ErrorCode,
  BAD_REQUEST: 'BAD_REQUEST' as ErrorCode,
};

export function createError(code: ErrorCode, message: string, fields?: Record<string, string>): ApiErrorClass {
  return new ApiErrorClass(code, message, fields);
}

export function handleError(error: unknown): ApiError {
  if (error instanceof ApiErrorClass) {
    return error.toJSON();
  }

  if (error instanceof Error) {
    return {
      error: {
        code: errorCodes.INTERNAL_ERROR,
        message: error.message || 'An unexpected error occurred',
      },
    };
  }

  return {
    error: {
      code: errorCodes.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
    },
  };
}
