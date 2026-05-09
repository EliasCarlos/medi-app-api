import { Inject, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AppError } from '../../../core/errors/app.error';
import { PrismaService } from '../../../shared/database/prisma.service';
import { HashingService } from '../../../shared/providers/hashing/hashing.service';
import {
  CreateUserData,
  IUsersRepository,
} from '../../users/interfaces/user.repository.interface';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { DoctorEntity } from '../entities/doctor.entity';
import { IDoctorsRepository } from '../interfaces/doctors.respository.interface';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(IDoctorsRepository)
    private readonly doctorsRepository: IDoctorsRepository,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<DoctorEntity> {
    const { email, password, crm, ...profileData } = createDoctorDto;

    const userExists = await this.usersRepository.findByEmail(email);
    if (userExists) {
      throw new AppError('Email already registered', 409);
    }

    const crmExists = await this.doctorsRepository.findByCrm(crm);
    if (crmExists) {
      throw new AppError('CRM already registered', 409);
    }

    const hashedPassword = await this.hashingService.hash(password);

    return this.prisma.$transaction(async (tx) => {
      const user = await this.usersRepository.create(
        {
          email,
          password: hashedPassword,
          role: Role.DOCTOR,
        },
        tx,
      );

      const doctor = await this.doctorsRepository.create(
        {
          ...profileData,
          crm,
          user: { connect: { id: user.id } },
        },
        tx,
      );

      return doctor;
    });
  }

  async findAll(): Promise<DoctorEntity[]> {
    return this.doctorsRepository.findAll();
  }

  async findById(id: string): Promise<DoctorEntity> {
    const doctor = await this.doctorsRepository.findById(id);

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    return doctor;
  }

  async update(
    id: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<DoctorEntity> {
    const doctor = await this.findById(id);

    const { email, password, role, ...profileData } = updateDoctorDto;

    if (email && email !== doctor.user?.email) {
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
        await this.usersRepository.update(doctor.userId, userData, tx);
      }

      return this.doctorsRepository.update(id, profileData, tx);
    });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.doctorsRepository.delete(id);
  }
}
