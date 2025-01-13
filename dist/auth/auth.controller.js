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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const successResponse_1 = require("../Common/Re-useable/successResponse");
const config_1 = require("@nestjs/config");
const auth_guard_1 = require("../Common/guard/auth.guard");
const role_decorator_1 = require("../Common/decorators/role.decorator");
const client_1 = require("@prisma/client");
const zodValidatiionPipe_1 = require("../Common/pipes/zodValidatiionPipe");
const auth_zodSchema_1 = require("./auth.zodSchema");
let AuthController = class AuthController {
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    async signup(res, next, body) {
        try {
            const result = await this.authService.signupDB(body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Signup done'));
        }
        catch (error) {
            next(error);
        }
    }
    async loginUser(res, next, body) {
        try {
            const result = await this.authService.loginUserDB(body);
            const { refreshToken } = result;
            res.cookie('refreshToken', refreshToken, {
                secure: this.configService.get('env') === 'production',
                httpOnly: true,
            });
            res.send((0, successResponse_1.successResponse)({
                accessToken: result.accessToken,
                refreshToken,
            }, common_1.HttpStatus.OK, 'Signup successfully!'));
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const result = await this.authService.refreshTokenDB(refreshToken);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'refresh token send'));
        }
        catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            const result = await this.authService.changePasswordDB(req?.user, req?.body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Password change'));
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const result = await this.authService.forgotPasswordDB(req?.body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'email send message'));
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const token = req.headers.authorization || '';
            const result = await this.authService.resetPasswordDB(token, req?.body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Password change done'));
        }
        catch (error) {
            next(error);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(auth_zodSchema_1.authSchemas.signupSchema)),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Next)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(auth_zodSchema_1.authSchemas.loginSchema)),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Next)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('forget-password'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map