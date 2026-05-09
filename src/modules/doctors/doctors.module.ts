import { Module } from '@nestjs/common';
import { HashingModule } from 'src/shared/providers/hashing/hashing.module';
import { UsersModule } from '../users/users.module';
import { DoctorsController } from './controllers/doctors.controller';
import { IDoctorsRepository } from './interfaces/doctors.respository.interface';
import { DoctorsPrismaRepository } from './repositories/doctors.prisma.repository';
import { DoctorsService } from './services/doctors.service';

@Module({
  imports: [HashingModule, UsersModule],
  controllers: [DoctorsController],
  providers: [
    DoctorsService,
    {
      provide: IDoctorsRepository,
      useClass: DoctorsPrismaRepository,
    },
  ],
  exports: [DoctorsService],
})
export class DoctorsModule {}
