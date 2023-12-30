import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const bearerToken = req.headers['authorization']
    ?.replace('Bearer', '')
    .trim();

  try {
    if (!bearerToken) {
      throw new Error('Authorization token not provided');
    }

    const decodedToken = verify(bearerToken, process.env.JWT_SECRET);

    return decodedToken;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new Error('Invalid token signature');
    } else if (error instanceof TokenExpiredError) {
      throw new Error('Token has expired');
    } else {
      throw new Error('Invalid token');
    }
  }
});
