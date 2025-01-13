"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma.service");
const bcrypt = require("bcrypt");
const jwtHelpers_1 = require("../Common/helper/jwtHelpers");
const client_1 = require("@prisma/client");
const emil_utils_1 = require("../Common/utils/emil.utils");
let AuthService = class AuthService {
    constructor(emailUtils, configService, prisma, jwtHelperService) {
        this.emailUtils = emailUtils;
        this.configService = configService;
        this.prisma = prisma;
        this.jwtHelperService = jwtHelperService;
    }
    async signupDB(body) {
        const hashPass = await bcrypt.hash(body?.password, 12);
        const userData = {
            name: body?.name,
            email: body?.email,
            password: hashPass,
        };
        const result = await this.prisma.$transaction(async (tnx) => {
            const userInfo = await tnx.user.create({
                data: userData,
            });
            await tnx.userProfile.create({
                data: {
                    email: userInfo.email,
                    userId: userInfo.id,
                },
            });
            if (!userInfo) {
                throw new common_1.HttpException('Something went wrong !', common_1.HttpStatus.BAD_REQUEST);
            }
            const accessToken = this.jwtHelperService.generateToken({
                id: userInfo.id,
                email: userInfo?.email,
                role: userInfo?.role,
            }, this.configService.get('jwt.jwt_secret'), this.configService.get('jwt.expires_in'));
            const refreshToken = this.jwtHelperService.generateToken({ id: userInfo.id, email: userInfo?.email, role: userInfo?.role }, this.configService.get('jwt.refresh_token_secret'), this.configService.get('jwt.refresh_token_expires_in'));
            return {
                accessToken,
                refreshToken,
            };
        });
        return result;
    }
    async loginUserDB(payload) {
        const userData = await this.prisma.user.findUniqueOrThrow({
            where: {
                email: payload.email,
                status: client_1.UserStatus.active,
            },
        });
        const isCorrectPassword = await bcrypt.compare(payload.password, userData.password);
        if (!isCorrectPassword) {
            throw new common_1.HttpException('Password incorrect!', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const accessToken = this.jwtHelperService.generateToken({
            id: userData.id,
            email: userData?.email,
            role: userData?.role,
        }, this.configService.get('jwt.jwt_secret'), this.configService.get('jwt.expires_in'));
        const refreshToken = this.jwtHelperService.generateToken({ id: userData.id, email: userData?.email, role: userData?.role }, this.configService.get('jwt.refresh_token_secret'), this.configService.get('jwt.refresh_token_expires_in'));
        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshTokenDB(token) {
        let decodedData;
        try {
            decodedData = this.jwtHelperService.verifyToken(token, this.configService.get('jwt.refresh_token_secret'));
        }
        catch (err) {
            throw new common_1.HttpException(err?.message || 'You are not authorized!', common_1.HttpStatus.UNAUTHORIZED);
        }
        const userData = await this.prisma.user.findUniqueOrThrow({
            where: {
                email: decodedData.email,
                status: client_1.UserStatus.active,
            },
        });
        const accessToken = this.jwtHelperService.generateToken({
            id: userData.id,
            email: userData.email,
            role: userData.role,
        }, this.configService.get('jwt.jwt_secret'), this.configService.get('jwt.expires_in'));
        return {
            accessToken,
        };
    }
    async changePasswordDB(user, payload) {
        const userData = await this.prisma.user.findUniqueOrThrow({
            where: {
                email: user.email,
                status: client_1.UserStatus.active,
            },
        });
        const isCorrectPassword = await bcrypt.compare(payload.oldPassword, userData.password);
        if (!isCorrectPassword) {
            throw new Error('Password incorrect!');
        }
        const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
        await this.prisma.user.update({
            where: {
                email: userData.email,
            },
            data: {
                password: hashedPassword,
                lastPasswordChange: new Date(),
            },
        });
        return {
            message: 'Password changed successfully!',
        };
    }
    async forgotPasswordDB(payload) {
        const userData = await this.prisma.user.findUniqueOrThrow({
            where: {
                email: payload.email,
                status: client_1.UserStatus.active,
            },
        });
        const resetPassToken = this.jwtHelperService.generateToken({ id: userData.id, email: userData.email, role: userData.role }, this.configService.get('jwt.reset_pass_secret'), this.configService.get('jwt.reset_pass_token_expires_in'));
        const resetPassLink = this.configService.get('reset_pass_link') +
            `?userId=${userData.id}&token=${resetPassToken}`;
        await this.emailUtils.sendEmail(userData.email, 'E-Commerce password reset 5min !', `
        <div>
          <p>Dear User,</p>
          <p>Your password reset link is below:</p>
          <a href="${resetPassLink}">
            <button>Reset Password</button>
          </a>
        </div>
      `);
    }
    async resetPasswordDB(token, payload) {
        await this.prisma.user.findUniqueOrThrow({
            where: {
                id: payload.id,
                status: client_1.UserStatus.active,
            },
        });
        const isValidToken = this.jwtHelperService.verifyToken(token, this.configService.get('jwt.reset_pass_secret'));
        if (!isValidToken) {
            throw new common_1.ForbiddenException('Forbidden!');
        }
        const password = await bcrypt.hash(payload.password, 12);
        await this.prisma.user.update({
            where: {
                id: payload.id,
            },
            data: {
                password,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [emil_utils_1.EmailUtils,
        config_1.ConfigService,
        prisma_service_1.PrismaService,
        jwtHelpers_1.JwtHelperService])
], AuthService);
//# sourceMappingURL=auth.service.js.map