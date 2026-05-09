import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Env } from '../config/env.schema';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => {
        return {
          pinoHttp: {
            transport:
              configService.get('NODE_ENV', { infer: true }) !== 'production'
                ? {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                      colorize: true,
                      translateTime: 'SYS:standard',
                    },
                  }
                : undefined,
            autoLogging: true, // Registra automaticamente requests e responses
            redact: ['req.headers.authorization'], // Oculta tokens dos logs
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
