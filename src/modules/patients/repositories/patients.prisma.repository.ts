import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/database/prisma.service';
import { PatientEntity } from '../entities/patient.entity';
import {
  CreatePatientProfileData,
  IPatientsRepository,
} from '../interfaces/patients.repository.interface';

@Injectable()
export class PatientsPrismaRepository implements IPatientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreatePatientProfileData,
    tx?: Prisma.TransactionClient,
  ): Promise<PatientEntity> {
    const client = tx || this.prisma;

    const patient = await client.patientProfile.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return new PatientEntity(patient);
  }

  async findByCpf(
    cpf: string,
    tx?: Prisma.TransactionClient,
  ): Promise<PatientEntity | null> {
    const client = tx || this.prisma;

    const patient = await client.patientProfile.findUnique({
      where: { cpf },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!patient) return null;

    return new PatientEntity(patient);
  }

  async findAll(): Promise<PatientEntity[]> {
    const patients = await this.prisma.patientProfile.findMany({
      where: {
        user: { deletedAt: null },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return patients.map((patient) => new PatientEntity(patient));
  }

  async findById(id: string): Promise<PatientEntity | null> {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id, user: { deletedAt: null } },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!patient) return null;

    return new PatientEntity(patient);
  }

  async update(
    id: string,
    data: Partial<CreatePatientProfileData>,
    tx?: Prisma.TransactionClient,
  ): Promise<PatientEntity> {
    const client = tx || this.prisma;

    const patient = await client.patientProfile.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return new PatientEntity(patient);
  }

  async delete(id: string): Promise<void> {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (patient) {
      await this.prisma.user.update({
        where: { id: patient.userId },
        data: { deletedAt: new Date() },
      });
    }
  }
}
