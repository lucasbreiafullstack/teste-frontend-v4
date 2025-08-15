import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { ContabilidadeModule } from './modules/contabilidade/contabilidade.module';

@Module({
  imports: [
    // Configuração global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Configuração do banco de dados
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Módulos funcionais
    AuthModule,
    UsuariosModule,
    ContabilidadeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}