import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtHelperService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: any, expiresIn: string): string {
    return this.jwtService.sign(payload, { expiresIn });
  }

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token) as JwtPayload;
    } catch (error) {
      console.log(error);
      throw new Error('Invalid Token');
    }
  }
}
