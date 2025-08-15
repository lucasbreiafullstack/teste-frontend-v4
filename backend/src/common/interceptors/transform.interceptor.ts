import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        // Se a resposta já está no formato correto, retorna como está
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Determina a mensagem baseada no status code
        let message: string;
        switch (statusCode) {
          case 200:
            message = 'Operação realizada com sucesso';
            break;
          case 201:
            message = 'Recurso criado com sucesso';
            break;
          case 204:
            message = 'Operação realizada com sucesso';
            break;
          default:
            message = 'Operação realizada com sucesso';
        }

        return {
          success: true,
          data,
          message,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}