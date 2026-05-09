import { Prisma, Session } from '@prisma/client';

export interface ISessionsRepository {
  create(data: Prisma.SessionUncheckedCreateInput): Promise<Session>;
  findByUserIdAndIp(userId: string, ip: string): Promise<Session | null>;
  updateRefreshToken(id: string, refreshTokenHash: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteById(id: string): Promise<void>;
}

export const ISessionsRepository = Symbol('ISessionsRepository');
