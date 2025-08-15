import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  details?: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as any;
    
    let message: string | string[];
    let error: string;
    let details: any;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = exception.name;
    } else {
      message = exceptionResponse.message || exception.message;
      error = exceptionResponse.error || exception.name;
      details = exceptionResponse.details;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    if (details) {
      errorResponse.details = details;
    }

    // Log do erro
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `HTTP ${status} Error: ${JSON.stringify(errorResponse)}`,
        exception.stack,
      );
    } else {
      this.logger.warn(`HTTP ${status} Error: ${JSON.stringify(errorResponse)}`);
    }

    // Log de auditoria para ações sensíveis
    if (request.user && (status === HttpStatus.FORBIDDEN || status === HttpStatus.UNAUTHORIZED)) {
      this.logger.warn(
        `Tentativa de acesso não autorizado: ${request.method} ${request.url} - Usuário: ${(request.user as any).email}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}