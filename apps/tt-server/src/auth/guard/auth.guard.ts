import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { Access } from '../decorators/access.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = this.extractRequestData(request).path;
    if (
      (path.substring(0, 5) === '/auth' &&
        path !== '/auth/verify' &&
        path !== '/auth/refresh') ||
      path.substring(path.length - 8) === '/webhook'
    ) {
      return true;
    }
    const token = this.extractRequestData(request).token;
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.usersService.findOneByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (user.data.active !== true) {
        throw new UnauthorizedException('User is not active');
      }
      if (user.data.blocked === true) {
        throw new UnauthorizedException('User is blocked');
      }
      for (const key in payload) {
        if (key === 'permissions') {
          const userPermissions = [];
          user.data.profile[key].forEach((p) => {
            userPermissions.push(p.label);
          });
          user.data.role[key].forEach((p) => {
            userPermissions.push(p.label);
          });
          const uPerms = userPermissions.sort().filter((v, i, a) => {
            return i === a.indexOf(v);
          });
          payload[key].sort();
          if (uPerms.toString() !== payload[key].toString()) {
            payload[key] = uPerms;
            payload.update = true;
          }
        } else if (key === 'iat') {
        } else if (user.data[key] !== payload[key]) {
          payload[key] = user.data[key];
          payload.update = true;
        }
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('There has been an unexpected error');
    }
    return this.checkPermits(context, request['user'].permissions);
  }

  private extractRequestData(request: Request): any {
    const path = request.route.path;
    const params = request.params;
    const token = request.headers.authorization?.split(' ')[1];
    return { path, params, token };
  }

  private checkPermits(
    context: ExecutionContext,
    permissions: string[],
  ): boolean {
    const permits = this.reflector.get(Access, context.getHandler());
    if (permits) {
      for (const permit of permits) {
        if (permissions.includes(permit)) {
          return true;
        }
      }
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return true;
  }
}
