import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (req: any) => {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          return authHeader.substring(7);
        }
        return null;
      },
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET || 'supersecretjwtkey',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.findUserById(payload.id || payload.sub);
    return user;
  }
}