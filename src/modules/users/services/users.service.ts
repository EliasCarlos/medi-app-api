import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../core/errors/app.error';
import { HashingService } from '../../../shared/providers/hashing/hashing.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
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

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );
      if (emailExists) {
        throw new AppError('Email already registered', 409);
      }
    }

    const data = { ...updateUserDto };

    if (data.password) {
      data.password = await this.hashingService.hash(data.password);
    }

    return this.usersRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.usersRepository.delete(id);
  }
}
