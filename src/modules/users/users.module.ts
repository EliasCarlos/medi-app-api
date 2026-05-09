import { Module } from '@nestjs/common';
import { HashingModule } from '../../shared/providers/hashing/hashing.module';
import { UsersController } from './controllers/users.controller';
import { IUsersRepository } from './interfaces/user.repository.interface';
import { UsersPrismaRepository } from './repositories/users.prisma.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [HashingModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: IUsersRepository,
      useClass: UsersPrismaRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
