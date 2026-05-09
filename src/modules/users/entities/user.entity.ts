import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  email: string;

  @Exclude()
  password?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
