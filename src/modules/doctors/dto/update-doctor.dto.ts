import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateDoctorDto {
  @ApiPropertyOptional({ example: 'doctor@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email is required' })
  email?: string;

  @ApiPropertyOptional({ example: 'newpassword123' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.DOCTOR })
  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role' })
  role?: Role;

  @ApiPropertyOptional({ example: 'Cardiology' })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({ example: 'RJ1234567' })
  @IsOptional()
  @IsString()
  crm?: string;
}
