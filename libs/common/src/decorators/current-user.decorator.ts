/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../models';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  const user = context.switchToHttp().getRequest().user;
  return user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
