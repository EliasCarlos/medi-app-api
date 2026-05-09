import { Exclude } from 'class-transformer';
import { Gender } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';

export class PatientEntity {
  @Exclude()
  id: string;

  @Exclude()
  userId: string;
  cpf: string;
  dateOfBirth: Date;
  gender: Gender;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;

  user?: UserEntity;

  constructor(partial: Partial<PatientEntity>) {
    Object.assign(this, partial);
    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }
  }
}
