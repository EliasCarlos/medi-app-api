import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma.service';
import { DoctorEntity } from '../entities/doctor.entity';
import {
  CreateDoctorProfileData,
  IDoctorsRepository,
} from '../interfaces/doctors.respository.interface';

@Injectable()
export class DoctorsPrismaRepository implements IDoctorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateDoctorProfileData,
    tx?: Prisma.TransactionClient,
  ): Promise<DoctorEntity> {
    const client = tx || this.prisma;

    const doctor = await client.doctorProfile.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          },
        },
      },
    });

    return new DoctorEntity(doctor);
  }

  async findByCrm(
    crm: string,
    tx?: Prisma.TransactionClient,
  ): Promise<DoctorEntity | null> {
    const client = tx || this.prisma;

    const doctor = await client.doctorProfile.findUnique({
      where: { crm },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          },
        },
      },
    });

    if (!doctor) return null;

    return new DoctorEntity(doctor);
  }

  async findAll(): Promise<DoctorEntity[]> {
    const doctors = await this.prisma.doctorProfile.findMany({
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
            deletedAt: true,
          },
        },
      },
    });

    return doctors.map((doctor) => new DoctorEntity(doctor));
  }

  async findById(id: string): Promise<DoctorEntity | null> {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          },
        },
      },
    });

    if (!doctor || doctor.user?.deletedAt) return null;

    return new DoctorEntity(doctor);
  }

  async update(
    id: string,
    data: Partial<CreateDoctorProfileData>,
    tx?: Prisma.TransactionClient,
  ): Promise<DoctorEntity> {
    const client = tx || this.prisma;

    const doctor = await client.doctorProfile.update({
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
            deletedAt: true,
          },
        },
      },
    });

    return new DoctorEntity(doctor);
  }

  async delete(id: string): Promise<void> {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (doctor) {
      await this.prisma.user.update({
        where: { id: doctor.userId },
        data: { deletedAt: new Date() },
      });
    }
  }
}
