import { Gender, Prisma } from '@prisma/client';
import { PatientEntity } from '../entities/patient.entity';

export type CreatePatientProfileData = {
  cpf: string;
  dateOfBirth: Date;
  gender: Gender;
  phoneNumber: string;
  user: { connect: { id: string } };
};

export const IPatientsRepository = Symbol('IPatientsRepository');

export interface IPatientsRepository {
  create(
    data: CreatePatientProfileData,
    tx?: Prisma.TransactionClient,
  ): Promise<PatientEntity>;
  findByCpf(
    cpf: string,
    tx?: Prisma.TransactionClient,
  ): Promise<PatientEntity | null>;
  findAll(): Promise<PatientEntity[]>;
  findById(id: string): Promise<PatientEntity | null>;
  update(
    id: string,
    data: Partial<CreatePatientProfileData>,
    tx?: Prisma.TransactionClient,
  ): Promise<PatientEntity>;
  delete(id: string): Promise<void>;
}
