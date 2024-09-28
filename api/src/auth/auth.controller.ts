import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('password') password: string, @Res() res: Response) {
    const token = await this.authService.validateUser(password);
    if (token) {
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.send({ success: true });
    } else {
      return res.status(401).send({ success: false });
    }
  }
}
