import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ApiStandardResponse } from '../../../shared/decorators/api-standard-response.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiStandardResponse(Object)
  async login(@Body() loginDto: LoginDto, @Req() request: Request) {
    const ip = request.ip || 'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';

    return this.authService.login(loginDto, ip, userAgent);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiStandardResponse(Object)
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() request: Request,
  ) {
    const ip = request.ip || 'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';

    return this.authService.refresh(
      refreshTokenDto.refreshToken,
      ip,
      userAgent,
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiNoContentResponse({ description: 'Session invalidated successfully' })
  async logout(@CurrentUser('sub') userId: string, @Req() request: Request) {
    const ip = request.ip || 'unknown';
    return this.authService.logout(userId, ip);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiStandardResponse(UserEntity)
  async getMe(@CurrentUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }
}
