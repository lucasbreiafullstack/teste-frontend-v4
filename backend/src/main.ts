import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';
import * as cors from 'cors';
import rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Configurações de segurança
  app.use(helmet());

  // Configurações de CORS
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  app.use(cors({
    origin: corsOrigin.split(','),
    credentials: true,
  }));

  // Rate limiting
  const rateLimitTtl = configService.get<number>('RATE_LIMIT_TTL', 60);
  const rateLimitMax = configService.get<number>('RATE_LIMIT_LIMIT', 100);
  
  app.use(
    rateLimit({
      windowMs: rateLimitTtl * 1000, // TTL em segundos
      max: rateLimitMax, // Limite de requisições por janela de tempo
      message: {
        error: 'Too Many Requests',
        message: 'Limite de requisições excedido. Tente novamente em alguns minutos.',
      },
    }),
  );

  // Prefixo global da API
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);

  // Pipes globais
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtros globais
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptors globais
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Configuração do Swagger
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Sistema de Gestão Pública - API')
      .setDescription('API do Sistema de Gestão Pública Integrada para o Município de Mendes/RJ')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('auth', 'Autenticação e autorização')
      .addTag('usuarios', 'Gestão de usuários')
      .addTag('contabilidade', 'Módulo de contabilidade')
      .addTag('orcamento', 'Módulo de orçamento')
      .addTag('compras', 'Módulo de compras e licitações')
      .addTag('rh', 'Módulo de recursos humanos')
      .addTag('tributacao', 'Módulo de tributação')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(`📚 Documentação disponível em: http://localhost:${configService.get('PORT', 3001)}/${apiPrefix}/docs`);
  }

  // Iniciar servidor
  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  logger.log(`🚀 Servidor iniciado na porta ${port}`);
  logger.log(`🌍 Ambiente: ${configService.get<string>('NODE_ENV', 'development')}`);
  logger.log(`📡 API disponível em: http://localhost:${port}/${apiPrefix}`);
}

bootstrap().catch((error) => {
  Logger.error('❌ Erro ao iniciar a aplicação:', error);
  process.exit(1);
});