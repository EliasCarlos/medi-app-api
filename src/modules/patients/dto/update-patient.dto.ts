import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdatePatientDto {
  @ApiPropertyOptional({ example: 'patient@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email?: string;

  @ApiPropertyOptional({ example: 'newpassword123' })
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.PATIENT })
  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role' })
  role?: Role;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  @IsOptional()
  @IsEnum(Gender, { message: 'Invalid gender' })
  gender?: Gender;

  @ApiPropertyOptional({ example: '(11) 98765-4321' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
