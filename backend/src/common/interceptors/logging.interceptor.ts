import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const userId = (request.user as any)?.id || 'Anônimo';

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const { statusCode } = response;
        
        const logMessage = `${method} ${url} ${statusCode} ${duration}ms - IP: ${ip} - User: ${userId}`;
        
        if (statusCode >= 400) {
          this.logger.warn(logMessage);
        } else {
          this.logger.log(logMessage);
        }

        // Log detalhado para desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          this.logger.debug(`Headers: ${JSON.stringify(headers)}`);
          this.logger.debug(`User-Agent: ${userAgent}`);
        }

        // Log de auditoria para operações sensíveis
        if (this.isSensitiveOperation(method, url)) {
          this.logger.warn(
            `Operação sensível realizada: ${method} ${url} - Usuário: ${userId} - IP: ${ip} - Status: ${statusCode}`,
          );
        }
      }),
    );
  }

  private isSensitiveOperation(method: string, url: string): boolean {
    const sensitivePatterns = [
      /\/auth\//,
      /\/usuarios.*\/(delete|remove)/,
      /\/contabilidade.*\/(delete|remove|aprovar)/,
      /\/admin\//,
    ];

    const sensitiveMethods = ['DELETE', 'PUT', 'PATCH'];

    return (
      sensitiveMethods.includes(method) ||
      sensitivePatterns.some(pattern => pattern.test(url))
    );
  }
}