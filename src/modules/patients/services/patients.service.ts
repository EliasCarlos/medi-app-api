import { Inject, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AppError } from '../../../core/errors/app.error';
import { PrismaService } from '../../../shared/database/prisma.service';
import { HashingService } from '../../../shared/providers/hashing/hashing.service';
import {
  CreateUserData,
  IUsersRepository,
} from '../../users/interfaces/user.repository.interface';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientEntity } from '../entities/patient.entity';
import { IPatientsRepository } from '../interfaces/patients.repository.interface';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(IPatientsRepository)
    private readonly patientsRepository: IPatientsRepository,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<PatientEntity> {
    const { email, password, cpf, ...profileData } = createPatientDto;

    const userExists = await this.usersRepository.findByEmail(email);
    if (userExists) {
      throw new AppError('Email already registered', 409);
    }

    const cpfExists = await this.patientsRepository.findByCpf(cpf);
    if (cpfExists) {
      throw new AppError('CPF already registered', 409);
    }

    const hashedPassword = await this.hashingService.hash(password);

    return this.prisma.$transaction(async (tx) => {
      const user = await this.usersRepository.create(
        {
          email,
          password: hashedPassword,
          role: Role.PATIENT,
        },
        tx,
      );

      const patient = await this.patientsRepository.create(
        {
          ...profileData,
          cpf,
          user: { connect: { id: user.id } },
        },
        tx,
      );

      return patient;
    });
  }

  async findAll() {
    return this.patientsRepository.findAll();
  }

  async findById(id: string) {
    const patient = await this.patientsRepository.findById(id);

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.findById(id);

    const { email, password, role, ...profileData } = updatePatientDto;

    if (email && email !== patient.user?.email) {
      const emailExists = await this.usersRepository.findByEmail(email);
      if (emailExists) {
        throw new AppError('Email already registered', 409);
      }
    }

    const userData: Partial<CreateUserData> = {};
    if (email) userData.email = email;
    if (role) userData.role = role;
    if (password) {
      userData.password = await this.hashingService.hash(password);
    }

    return this.prisma.$transaction(async (tx) => {
      if (Object.keys(userData).length > 0) {
        await this.usersRepository.update(patient.userId, userData, tx);
      }

      return this.patientsRepository.update(id, profileData, tx);
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.patientsRepository.delete(id);
  }
}
