import { AuthService } from './auth.service';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    signup(res: Response, next: NextFunction, body: any): Promise<Response<any, Record<string, any>>>;
    loginUser(res: Response, next: NextFunction, body: any): Promise<void>;
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    changePassword(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    forgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
