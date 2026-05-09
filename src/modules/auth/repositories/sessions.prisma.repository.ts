import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import { PrismaService } from '../../../shared/database/prisma.service';
import { ISessionsRepository } from '../interfaces/sessions.repository.interface';

@Injectable()
export class SessionsPrismaRepository implements ISessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SessionUncheckedCreateInput): Promise<Session> {
    return this.prisma.session.create({ data });
  }

  async findByUserIdAndIp(userId: string, ip: string): Promise<Session | null> {
    return this.prisma.session.findFirst({
      where: { userId, ip },
    });
  }

  async updateRefreshToken(id: string, refreshTokenHash: string) {
    await this.prisma.session.update({
      where: { id },
      data: { refreshTokenHash },
    });
  }

  async deleteByUserId(userId: string) {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async deleteById(id: string) {
    await this.prisma.session.delete({
      where: { id },
    });
  }
}
