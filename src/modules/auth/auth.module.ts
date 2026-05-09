import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashingModule } from '../../shared/providers/hashing/hashing.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { ISessionsRepository } from './interfaces/sessions.repository.interface';
import { SessionsPrismaRepository } from './repositories/sessions.prisma.repository';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [HashingModule, UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: ISessionsRepository,
      useClass: SessionsPrismaRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
