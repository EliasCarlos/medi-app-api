import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/database/prisma.service';
import { UserEntity } from '../entities/user.entity';
import {
  CreateUserData,
  IUsersRepository,
} from '../interfaces/user.repository.interface';

@Injectable()
export class UsersPrismaRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateUserData,
    tx?: Prisma.TransactionClient,
  ): Promise<UserEntity> {
    const client = tx || this.prisma;

    const user = await client.user.create({
      data,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new UserEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    if (!user) return null;

    return new UserEntity(user);
  }

  async findByEmail(
    email: string,
    tx?: Prisma.TransactionClient,
  ): Promise<UserEntity | null> {
    const client = tx || this.prisma;

    const user = await client.user.findUnique({
      where: { email, deletedAt: null },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    if (!user) return null;

    return new UserEntity(user);
  }

  async findCredentialsByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
    });

    if (!user) return null;

    return new UserEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return users.map((user) => new UserEntity(user));
  }

  async update(
    id: string,
    data: Partial<CreateUserData>,
    tx?: Prisma.TransactionClient,
  ): Promise<UserEntity> {
    const client = tx || this.prisma;

    const user = await client.user.update({
      where: { id, deletedAt: null },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return new UserEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
