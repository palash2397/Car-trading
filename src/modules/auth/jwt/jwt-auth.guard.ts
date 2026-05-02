import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // 1. Get token from header (same as Express)
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException(
        new ApiResponse(401, {}, 'No token provided'),
      );
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      throw new UnauthorizedException(
        new ApiResponse(401, {}, 'No token provided'),
      );
    }

    // 2. Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      console.log('Decoded JWT:', decoded);

      request.user = decoded;

      return true;
    } catch (err) {
      console.log(`JWT verification error: `, err);
      throw new UnauthorizedException(
        new ApiResponse(401, {}, 'Invalid token'),
      );
    }
  }
}
