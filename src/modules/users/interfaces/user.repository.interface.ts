import { Role } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';

export type CreateUserData = {
  email: string;
  password: string;
  role?: Role;
};

export const IUsersRepository = Symbol('IUsersRepository');

export interface IUsersRepository {
  create(data: CreateUserData): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findCredentialsByEmail(email: string): Promise<UserEntity | null>;
}
