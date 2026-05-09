import { Prisma, Role } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';

export type CreateUserData = {
  email: string;
  password: string;
  role?: Role;
};

export const IUsersRepository = Symbol('IUsersRepository');

export interface IUsersRepository {
  create(
    data: CreateUserData,
    tx?: Prisma.TransactionClient,
  ): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(
    email: string,
    tx?: Prisma.TransactionClient,
  ): Promise<UserEntity | null>;
  findCredentialsByEmail(email: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  update(
    id: string,
    data: Partial<CreateUserData>,
    tx?: Prisma.TransactionClient,
  ): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
