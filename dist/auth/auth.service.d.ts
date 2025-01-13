import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { JwtHelperService } from 'src/Common/helper/jwtHelpers';
import { EmailUtils } from 'src/Common/utils/emil.utils';
export declare class AuthService {
    private readonly emailUtils;
    private configService;
    private prisma;
    private jwtHelperService;
    constructor(emailUtils: EmailUtils, configService: ConfigService, prisma: PrismaService, jwtHelperService: JwtHelperService);
    signupDB(body: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    loginUserDB(payload: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokenDB(token: any): Promise<{
        accessToken: string;
    }>;
    changePasswordDB(user: any, payload: any): Promise<{
        message: string;
    }>;
    forgotPasswordDB(payload: {
        email: string;
    }): Promise<void>;
    resetPasswordDB(token: string, payload: {
        id: string;
        password: string;
    }): Promise<void>;
}
