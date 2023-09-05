/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email' });
  }

  // Whatever thing we returned in this function,gets, automatically added to the request object as the user property
  async validate(email: string, password: string) {
    try {
      return this.usersService.verifyUser(email, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
