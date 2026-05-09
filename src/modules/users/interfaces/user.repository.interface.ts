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
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findCredentialsByEmail(email: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  update(id: string, data: Partial<CreateUserData>): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
