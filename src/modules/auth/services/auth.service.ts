import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppError } from '../../../core/errors/app.error';
import { Env } from '../../../shared/config/env.schema';
import { HashingService } from '../../../shared/providers/hashing/hashing.service';
import { IUsersRepository } from '../../users/interfaces/user.repository.interface';
import { LoginDto } from '../dto/login.dto';
import { ISessionsRepository } from '../interfaces/sessions.repository.interface';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env>,
    private readonly hashingService: HashingService,
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(ISessionsRepository)
    private readonly sessionsRepository: ISessionsRepository,
  ) {}

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const user = await this.usersRepository.findCredentialsByEmail(
      loginDto.email,
    );

    if (!user || !user.password) {
      throw new AppError('Invalid credentials', 401);
    }

    const passwordMatches = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new AppError('Invalid credentials', 401);
    }

    return this.generateTokens(user.id, user.email, user.role, ip, userAgent);
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    ip: string,
    userAgent: string,
  ) {
    const payload: TokenPayload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
    });

    const refreshTokenHash = await this.hashingService.hash(refreshToken);

    const existingSession = await this.sessionsRepository.findByUserIdAndIp(
      userId,
      ip,
    );

    if (existingSession) {
      await this.sessionsRepository.updateRefreshToken(
        existingSession.id,
        refreshTokenHash,
      );
    } else {
      await this.sessionsRepository.create({
        userId,
        refreshTokenHash,
        ip,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string, ip: string, userAgent: string) {
    try {
      const payload: TokenPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        },
      );

      const session = await this.sessionsRepository.findByUserIdAndIp(
        payload.sub,
        ip,
      );

      if (!session) {
        throw new AppError('Session not found', 401);
      }

      const isRefreshTokenValid = await this.hashingService.compare(
        refreshToken,
        session.refreshTokenHash,
      );

      if (!isRefreshTokenValid) {
        throw new AppError('Invalid refresh token', 401);
      }

      return this.generateTokens(
        payload.sub,
        payload.email,
        payload.role,
        ip,
        userAgent,
      );
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(userId: string, ip: string) {
    const session = await this.sessionsRepository.findByUserIdAndIp(userId, ip);
    if (session) {
      await this.sessionsRepository.deleteById(session.id);
    }
  }

  async getMe(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}
