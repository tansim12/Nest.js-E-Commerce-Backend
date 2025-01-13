import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class JwtHelperService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateToken(payload: any, token_secret: string, expires_in: string): string;
    verifyToken(token: string, token_secret: string): any;
}
