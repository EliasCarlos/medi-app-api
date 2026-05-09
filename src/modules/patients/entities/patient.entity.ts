import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';

export class PatientEntity {
  @Exclude()
  id: string;

  @Exclude()
  userId: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => UserEntity })
  user?: UserEntity;

  constructor(partial: Partial<PatientEntity>) {
    Object.assign(this, partial);
    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }
  }
}
