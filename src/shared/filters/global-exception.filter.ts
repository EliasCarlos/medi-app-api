import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from '../../core/errors/app.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof AppError) {
      statusCode = exception.statusCode;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      message =
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? (exceptionResponse as { message: string | string[] }).message
          : exception.message;
    }

    if (statusCode >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${Array.isArray(message) ? message.join(', ') : message}`,
      );
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
