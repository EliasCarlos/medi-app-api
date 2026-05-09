import { Module } from '@nestjs/common';
import { HashingModule } from '../../shared/providers/hashing/hashing.module';
import { UsersModule } from '../users/users.module';
import { PatientsController } from './controllers/patients.controller';
import { IPatientsRepository } from './interfaces/patients.repository.interface';
import { PatientsPrismaRepository } from './repositories/patients.prisma.repository';
import { PatientsService } from './services/patients.service';

@Module({
  imports: [HashingModule, UsersModule],
  controllers: [PatientsController],
  providers: [
    PatientsService,
    {
      provide: IPatientsRepository,
      useClass: PatientsPrismaRepository,
    },
  ],
  exports: [PatientsService],
})
export class PatientsModule {}
