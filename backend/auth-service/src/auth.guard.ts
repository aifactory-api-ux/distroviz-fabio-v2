import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    try {
      const tokenData = Buffer.from(token, 'base64').toString('utf-8');
      const [userId] = tokenData.split(':');
      const user = await this.authService.findUserById(userId);
      if (user) {
        request.user = user;
        return true;
      }
    } catch {
      return false;
    }

    return false;
  }
}