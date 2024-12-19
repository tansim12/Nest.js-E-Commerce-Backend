import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtHelperService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Access Token Generate Function
  generateToken(
    payload: any,
    token_secret: string,
    expires_in: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret: token_secret,
      expiresIn: expires_in,
    }); // Corrected property name
  }

  // Token Verify Function
  verifyToken(token: string, token_secret: string): any {
    const secret = this.configService.get<string>(token_secret);
    return this.jwtService.verify(token, { secret });
  }
}
