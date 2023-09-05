import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto, GetUserDto } from './dtos';
import { UsersRepository } from './repositories';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);

    const hashedPasswrod = await bcrypt.hash(createUserDto.password, 10);

    return this.usersRepository.create({
      ...createUserDto,
      password: hashedPasswrod,
    });
  }

  private async validateCreateUser(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException(
      `User with email: ${createUserDto.email} already exist`,
    );
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }
}
