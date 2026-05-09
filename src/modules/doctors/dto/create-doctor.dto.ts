import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ example: 'doctor@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty({ message: 'CRM is required' })
  @IsString()
  crm: string;

  @ApiProperty({ example: 'Cardiology' })
  @IsNotEmpty({ message: 'Specialty is required' })
  @IsString()
  specialty: string;
}
