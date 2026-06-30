import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { DOMAIN_ERROR_STATUS, DomainError } from './errors';

/**
 * Maps DomainError to its HTTP status and a stable error body: { error, message }.
 * Built-in HttpExceptions (e.g. validation 400) are passed through unchanged in
 * spirit but normalized to the same { error, message } envelope.
 *
 * This is the ONLY place domain errors become HTTP responses. Keep it that way.
 */
@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof DomainError) {
      const status = DOMAIN_ERROR_STATUS[exception.code];
      res.status(status).json({ error: exception.code, message: exception.message });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const message =
        typeof payload === 'string'
          ? payload
          : ((payload as Record<string, unknown>).message ?? exception.message);
      res.status(status).json({ error: 'VALIDATION_ERROR', message });
      return;
    }

    // Unknown error: fail loud, do not pretend success.
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Unexpected error' });
  }
}
