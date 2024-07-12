import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../authorization/types/jwtPayload';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);