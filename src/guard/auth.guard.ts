import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers['authorization']?.replace(
      'Bearer ',
      '',
    );

    if (!bearerToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const decodedToken = verify(bearerToken, process.env.JWT_SECRET);

      const isValidUser = await this.isAuthenticated(decodedToken);

      if (!isValidUser) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      return true;
    } catch (error) {
      console.error('JWT Verification Error:', error.message);

      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async isAuthenticated(decodedToken: any): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });

    if (!user) {
      return false;
    }

    return true;
  }
}
