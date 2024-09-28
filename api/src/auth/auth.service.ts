import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(password: string): Promise<string | null> {
    const masterPassword = this.configService.get<string>('MASTER_PASSWORD');
    if (password === masterPassword) {
      // Generate JWT token
      const payload = {};
      return this.jwtService.sign(payload);
    }
    return null;
  }
}
