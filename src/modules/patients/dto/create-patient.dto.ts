import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'patient@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsNotEmpty({ message: 'CPF is required' })
  @IsString()
  cpf: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, { message: 'Invalid gender' })
  gender: Gender;

  @ApiProperty({ example: '(11) 98765-4321' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phoneNumber: string;
}
