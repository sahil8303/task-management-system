import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// this handles basically everything that goes wrong
export const errorHandler = (
  err: Error | ApiError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // default to 500 if we dont know what happened
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: unknown = undefined;

  // check if its a zod validation thing
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    // map the errors so the frontend can actually read them
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  } else if (err instanceof ApiError) {
    // this is for errors we throw on purpose
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof Error) {
    message = err.message;
  }

  // only log in dev... dont want to spam production logs
  if (process.env.NODE_ENV === 'development') {
    console.error('DEBUG ERROR:', err);
  }

  // build the response object
  const response: Record<string, unknown> = {
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal server error'
        : message,
  };

  if (errors !== undefined) response.errors = errors;

  // send stack trace if we are debugging
  if (process.env.NODE_ENV === 'development') {
    response.stack = err instanceof Error ? err.stack : undefined;
  }

  res.status(statusCode).json(response);
};

// 404 handler for when they hit a route that doesnt exist
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
};