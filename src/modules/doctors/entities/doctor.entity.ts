import { Exclude } from 'class-transformer';
import { UserEntity } from '../../users/entities/user.entity';

export class DoctorEntity {
  @Exclude()
  id: string;

  @Exclude()
  userId: string;
  crm: string;
  specialty: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  user?: UserEntity;

  constructor(partial: Partial<DoctorEntity>) {
    Object.assign(this, partial);
    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }
  }
}
