import { Prisma } from '@prisma/client';
import { DoctorEntity } from '../entities/doctor.entity';

export type CreateDoctorProfileData = {
  crm: string;
  specialty: string;
  user: { connect: { id: string } };
};

export const IDoctorsRepository = Symbol('IDoctorsRepository');

export interface IDoctorsRepository {
  create(
    data: CreateDoctorProfileData,
    tx?: Prisma.TransactionClient,
  ): Promise<DoctorEntity>;
  findByCrm(
    crm: string,
    tx?: Prisma.TransactionClient,
  ): Promise<DoctorEntity | null>;
  findAll(): Promise<DoctorEntity[]>;
  findById(id: string): Promise<DoctorEntity | null>;
  update(
    id: string,
    data: Partial<CreateDoctorProfileData>,
    tx?: Prisma.TransactionClient,
  ): Promise<DoctorEntity>;
  delete(id: string): Promise<void>;
}
