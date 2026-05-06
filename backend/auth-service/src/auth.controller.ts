import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }

    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '3600', 10);
    const accessToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    return {
      accessToken,
      expiresIn,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() req: any) {
    const user = req.user;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}