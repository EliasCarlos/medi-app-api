import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role' })
  role?: Role;
}
