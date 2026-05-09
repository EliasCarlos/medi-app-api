import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../core/errors/app.error';
import { HashingService } from '../../../shared/providers/hashing/hashing.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUsersRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await this.hashingService.hash(
      createUserDto.password,
    );

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}
