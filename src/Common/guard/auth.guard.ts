import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('You have no access to this route');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      const { email } = decoded;
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email, isDelete: false, status: UserStatus.active },
      });

      if (user.isDelete) {
        throw new ForbiddenException('This User is already deleted!');
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('You have no access to this route');
      }

      // Attach user data to the request object
      request.user = { id: user.id, role: user.role, email: user.email };
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        error?.message || 'You have no access to this route',
      );
    }
  }
}
